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
 * @param  {String} key
 * @return {String|Object|Array}
 * @public
 */
Cache.prototype.get = function(key) {
  var self = this;

  var item = self.cache[key];
  if (item) {
    if (self.expired(item)) {
      delete self.cache[key];
      return null;
    }

    return item.value;
  }

  return null;
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
 * @param {String} key
 * @public
 */
Cache.prototype.del = function(key) {
  var self = this;

  var item = self.cache[key];
  if (item) {
    delete self.cache[key];
  }
};

/**
 * Determines if a cache object has expired
 * @param  {Object} item
 * @return {Boolean}
 * @private
 */
Cache.prototype.expired = function(item) {
  if (!item.ttl) {
    return false;
  }

  if (item.ttl < new Date().valueOf()) {
    return true;
  }

  return false;
};

module.exports = new Cache();
