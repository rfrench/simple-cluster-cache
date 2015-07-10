'use strict';

var Master = require('./clients/master');
var Worker = require('./clients/worker');

/**
 * CacheClient constructor
 * @constructor
 * @private
 */
function CacheClient(isMaster, cache) {
  var self = this;

  Object.defineProperty(self, 'client', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: (isMaster) ? new Master(cache) : new Worker()
  });
}

/**
 * Returns a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Optional callback
 * @return {String|Object|Array}
 * @public
 */
CacheClient.prototype.get = function(key, callback) {
  var self = this;

  if (!key) {
    var err = new Error('key is a required parameter');
    if (callback) {
      return callback(err);
    }

    throw err;
  }
  
  return self.client.get(key, callback);
};

/**
 * Sets a cache object
 * @param  {String}                key         Cache key
 * @param  {String|Object|Array}   value       Cache value
 * @param  {Number}                ttl         Cache object time to live
 * @param  {Function}              callback    Optional callback
 * @return {String|Object|Array}
 * @public
 */
CacheClient.prototype.set = function(key, value, ttl, callback) {
  var self = this;

  var cb = callback;
  if (typeof ttl === 'function') {
    cb = ttl;
    ttl = null;
  }

  if (!key || !value) {
    var err = new Error('key & value is required parameters');
    if (cb) {
      return cb(err);
    }
    
    throw err;
  }

  return self.client.set(key, value, ttl, cb);
};

/**
 * Deletes a cache object
 * @param  {String}   key         Cache key
 * @param  {Function} callback    Optional callback
 * @return {String|Object|Array}
 * @public
 */
CacheClient.prototype.del = function(key, callback) {
  var self = this;

  if (!key) {
    var err = new Error('key is a required parameter');
    if (callback) {
      return callback(err);
    }

    throw err;
  }
  
  return self.client.del(key, callback);
};

/**
 * Clears the cache
 * @param  {Function} callback  Callback
 * @public
 */
CacheClient.prototype.clear = function(callback) {
  var self = this;

  return self.client.clear(callback);
};

module.exports = CacheClient;
