'use strict';

/**
 * Cache constructor
 * @constructor
 */
function Cache() {
  var self = this;

  // cache
  Object.defineProperty(self, 'cache', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: {}
  });
}

/**
 * Returns a cache object
 * @param  {String|Array} key
 * @return {String|Object|Array}
 * @public
 */
Cache.prototype.get = function(key) {
  var self = this;

  if (Array.isArray(key)) {
    var keys = [].concat(key);

    var results = {};
    for (var i = 0; i < keys.length; i++) {
      results[keys[i]] = self._getKey(keys[i]);
    }

    return results;
  }

  return self._getKey(key);
};

/**
 * Sets a cache object
 * @param {String}               key
 * @param {String|Object|Array}  value
 * @param {Number}               ttl
 * @public
 */
Cache.prototype.set = function(key, value, ttl) {
  var self = this;

  var obj = {
    key: key,
    value: value,
    ttl: (ttl && !isNaN(ttl)) ? (new Date().valueOf() + parseInt(ttl, 10)) : null
  };
  self.cache[key] = obj;

  return value;
};

/**
 * Deletes a cache object
 * @param {String|Array} key
 * @public
 */
Cache.prototype.del = function(key) {
  var self = this;

  var keys = [].concat(key);
  for(var i = 0; i < keys.length; i++) {
    var item = self.cache[key];
    if (item) {
      delete self.cache[key];
    }
  }
};

/**
 * Clears the cache
 * @param {String|Array} key
 * @public
 */
Cache.prototype.clear = function() {
  var self = this;

  self.cache = {};
};

/**
 * Returns a cache object
 * @param {String|Array} key
 * @param {String|Object|Array}  value
 * @private
 */
Cache.prototype._getKey = function(key) {
  var self = this;

  var item = self.cache[key];
  if (item) {
    if (self._expired(item)) {
      delete self.cache[key];
      return null;
    }

    return item.value;
  }

  return null;
};

/**
 * Determines if a cache object has expired
 * @param  {Object} item
 * @return {Boolean}
 * @private
 */
Cache.prototype._expired = function(item) {
  if (!item.ttl) {
    return false;
  }

  if (item.ttl < new Date().valueOf()) {
    return true;
  }

  return false;
};

module.exports = new Cache();
