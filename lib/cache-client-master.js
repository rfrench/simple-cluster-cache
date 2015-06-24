'use strict';

/**
 * CacheClientMaster constructor
 * @constructor
 * @private
 */
function CacheClientMaster(cache) {
  var self = this;

  // cache reference
  Object.defineProperty(self, 'cache', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: cache
  });
}

/**
 * Returns a cache object
 * @param  {String}   key       Cache key
 * @param  {Function} callback  callback
 * @return {String|Object|Array}
 * @public
 */
CacheClientMaster.prototype.get = function(key, callback) {
  var self = this;

  if (!key) {
    return callback(new Error('key is a required parameter'));
  }
  
  return callback(null, self.cache[key]);
};

/**
 * Sets a cache object
 * @param {String}                key      Cache key
 * @param {String|Object|Array}   value    Cache value
 * @param {Function}              callback
 * @public
 */
CacheClientMaster.prototype.set = function(key, value, callback) {
  var self = this;

  if (!key || !value) {
    return callback(new Error('key & value is required parameters'));
  }

  self.cache[key] = value;

  return callback(null, value);
};

/**
 * Deletes a cache object
 * @param  {String}   key       Cache key
 * @param  {Function} callback  callback
 * @public
 */
CacheClientMaster.prototype.del = function(key, callback) {
  var self = this;

  if (!key) {
    return callback(new Error('key is a required parameter'));
  }
  
  delete self.cache[key];

  return callback(null);
};

module.exports = CacheClientMaster;
