'use strict';

var simpleflake = require('simpleflake');

/**
 * CacheClient constructor
 * @constructor
 * @private
 */
function CacheClient() {
  var self = this;

  // callbacks
  Object.defineProperty(self, 'callbacks', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: {}
  });

  // receives messages from master
  process.on('message', function(msg) {
    if (msg.origin && msg.origin === 'cache-cluster') {
      var callback = self.callbacks[msg.id];
      delete self.callbacks[msg.id];
      return callback(msg.value);
    }
  });
}

/**
 * Returns a cache object
 * @param  {String}   key       Cache key
 * @param  {Function} callback  callback
 * @return {String|Object|Array}
 * @public
 */
CacheClient.prototype.get = function(key, callback) {
  var self = this;

  if (!key) {
    return callback(new Error('key is a required parameter'));
  }
  
  self.message('get', key, null, callback);
};

/**
 * Sets a cache object
 * @param {String}                key      Cache key
 * @param {String|Object|Array}   value    Cache value
 * @param {Function}              callback
 * @public
 */
CacheClient.prototype.set = function(key, value, callback) {
  var self = this;

  if (!key || !value) {
    return callback(new Error('key & value is required parameters'));
  }

  self.message('set', key, value, callback);
};

/**
 * Sends a message to the master process
 * @param  {String}                action   Message action
 * @param  {String}                key      Cache key
 * @param  {String|Object|Array}   value    Cache value
 * @param  {Function}              callback
 * @private
 */
CacheClient.prototype.message = function(action, key, value, callback) {
  var self = this;

  var msg = {
    origin: 'cache-cluster',
    action: action,
    key: key,
    id: simpleflake().toString('base58'),
    value: value
  };
  self.callbacks[msg.id] = callback;

  return process.send(msg);
};

module.exports = new CacheClient();
