'use strict';

var shortid = require('shortid');

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

  return self._message({ action: 'get', key: key, callback: callback });
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

  return self._message({ action: 'set', key: key, value: value, ttl: ttl, callback: callback });
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

  return self._message({ action: 'del', key: key, callback: callback });
};

/**
 * Clears the cache
 * @param  {Function} callback  Callback
 * @private
 */
Worker.prototype.clear = function(callback) {
  var self = this;

  return self._message({ action: 'clear', callback: callback });
};

/**
 * Sends a message to the master process
 * @param  {Object} args  Message arguments
 * @private
 */
Worker.prototype._message = function(args) {
  var self = this;

  var msg = {
    origin: 'cache-cluster',
    action: args.action,
    key: args.key,
    id: shortid.generate(),
    ttl: args.ttl,
    value: args.value
  };
  self.callbacks[msg.id] = args.callback;

  return process.send(msg);
};

module.exports = Worker;
