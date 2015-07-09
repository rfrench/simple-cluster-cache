'use strict';

/**
 * Worker constructor
 * @constructor
 * @private
 */
function Worker() {
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
      if (callback) {
        delete self.callbacks[msg.id];
        return callback(null, msg.value);
      }
    }
  });
}

/**
 * Returns a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Callback
 * @return {String|Object|Array}
 * @private
 */
Worker.prototype.get = function(key, callback) {
  var self = this;

  return self.message('get', key, null, null, callback);
};

/**
 * Sets a cache object
 * @param  {String}                key         Cache key
 * @param  {String|Object|Array}   value       Cache value
 * @param  {Number}                ttl         Cache object time to live
 * @param  {Function}              callback    Callback
 * @return {String|Object|Array}
 * @private
 */
Worker.prototype.set = function(key, value, ttl, callback) {
  var self = this;

  return self.message('set', key, value, ttl, callback);
};

/**
 * Deletes a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Callback
 * @return {String|Object|Array}
 * @private
 */
Worker.prototype.del = function(key, callback) {
  var self = this;

  return self.message('del', key, null, null, callback);
};

/**
 * Sends a message to the master process
 * @param  {String}                action   Message action
 * @param  {String}                key      Cache key
 * @param  {String|Object|Array}   value    Cache value
 * @param  {Function}              callback
 * @private
 */
Worker.prototype.message = function(action, key, value, ttl, callback) {
  var self = this;

  var msg = {
    origin: 'cache-cluster',
    action: action,
    key: key,
    id: new Date().valueOf(),
    ttl: ttl,
    value: value
  };
  self.callbacks[msg.id] = callback;

  return process.send(msg);
};

module.exports = Worker;
