# simple-cluster-cache [![NPM version](https://badge.fury.io/js/simple-cluster-cache.png)](http://badge.fury.io/js/simple-cluster-cache)
Dead simple cluster based object cache for node.js.

## Install
```bash
$ npm install simple-cluster-cache
```

## Methods
- `get(key, callback)`. Gets the value from cache. Returns undefined if the value does not exist.
- `set(key, value, callback)`. Sets a cache object for the specified key.
- `del(key, callback)`. Deletes a key from cache.

## Usage
``` js
cache.set('hello', 'world', function(err, value) {
  console.log(value);
});

cache.get('hello', function(err, value) {
  // prints 'world'
  console.log(value);
});

cache.del('hello', function(err) {
  console.log('deleted');  
});
```
