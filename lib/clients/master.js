'use strict';

/**
 * Master constructor
 * @constructor
 * @private
 */
function Master(cache) {
  var self = this;

  Object.defineProperty(self, 'cache', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: cache
  });
}

/**
 * Returns a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Optional callback
 * @return {String|Object|Array}
 * @private
 */
Master.prototype.get = function(key, callback) {
  var self = this;

  var value = self.cache.get(key);
  if (callback) {
    return callback(null, value);
  }

  return value;
};

/**
 * Sets a cache object
 * @param  {String}                key         Cache key
 * @param  {String|Object|Array}   value       Cache value
 * @param  {Number}                ttl         Cache object time to live
 * @param  {Function}              callback    Optional callback
 * @return {String|Object|Array}
 * @private
 */
Master.prototype.set = function(key, value, ttl, callback) {
  var self = this;

  self.cache.set(key, value, ttl);
  if (callback) {
    return callback(null, value);
  }

  return value;
};

/**
 * Deletes a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Optional callback
 * @return {String|Object|Array}
 * @private
 */
Master.prototype.del = function(key, callback) {
  var self = this;

  var value = self.cache.get(key);
  self.cache.del(key);
  if (callback) {
    return callback(null, value);
  }

  return value;
};

module.exports = Master;