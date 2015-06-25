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
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Optional callback
 * @return {String|Object|Array}
 * @public
 */
CacheClientMaster.prototype.get = function(key, callback) {
  var self = this;

  if (!key) {
    var err = new Error('key is a required parameter');
    if (callback) {
      return callback(err);
    }

    throw err;
  }
  
  if (callback) {
    return callback(null, self.cache[key]);
  }

  return self.cache[key];
};

/**
 * Sets a cache object
 * @param  {String}                key         Cache key
 * @param  {String|Object|Array}   value       Cache value
 * @param  {Function}              callback    Optional callback
 * @return {String|Object|Array}
 * @public
 */
CacheClientMaster.prototype.set = function(key, value, callback) {
  var self = this;

  if (!key || !value) {
    var err = new Error('key & value is required parameters');
    if (callback) {
      return callback(err);
    }
    
    throw err;
  }

  self.cache[key] = value;

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
 * @public
 */
CacheClientMaster.prototype.del = function(key, callback) {
  var self = this;

  if (!key) {
    var err = new Error('key is a required parameter');
    if (callback) {
      return callback(err);
    }

    throw err;
  }
  
  var value = self.cache[key];
  delete self.cache[key];

  if (callback) {
    return callback(null, value);
  }

  return value;
};

module.exports = CacheClientMaster;
