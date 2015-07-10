# simple-cluster-cache [![Build Status](https://api.travis-ci.org/rfrench/simple-cluster-cache.svg?branch=master)](https://travis-ci.org/rfrench/simple-cluster-cache) [![NPM version](https://badge.fury.io/js/simple-cluster-cache.png)](http://badge.fury.io/js/simple-cluster-cache)
Dead simple in-memory cache that allows the master process and the worker processes to share the same object cache.

## Install
```bash
$ npm install simple-cluster-cache
```

## Methods
- `get(key, callback)` - Gets the value from cache. Returns undefined if the value does not exist.
    - `key`: The unique cache object key.
    - `callback`: The optional callback function.
- `set(key, value, ttl, callback)` - Sets a cache object for the specified key.
    - `key`: The unique cache object key.
    - `value`: The cache object value.
    - `ttl`: The optional time to live on the cache object. (milliseconds)
    - `callback`: The optional callback function. 
- `del(key, callback)` - Deletes a key from cache.
    - `key`: The unique cache object key.
    - `callback`: The optional callback function.

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

## Example
``` js
'use strict';

var cluster = require('cluster');
var cache = require('../lib/cluster-cache');
var express = require('express');
var os = require('os');

if (cluster.isMaster) {

  var cpus = os.cpus().length;
  for (var i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });

  // preload some keys just to demonstrate it works from the master thread
  cache.set('hello', 'world', 5000);
  cache.set('object', { 'hello': 'world' });
  cache.set('array', [ 1, 2, 3 ]);
  cache.set('callback', true, function(err, value) {
    console.log('successfully set "callback" to %s', value);
  });
}
else {
  var app = express();

  // gets the key from cache
  app.get('/:key', function(req, res, next) {
    var key = req.params.key;
    cache.get(key, function(err, value) {
      res.json(value);
    });
  });

  // sets the cache value
  app.post('/:key/:value/:ttl?', function(req, res, next) {
    var key = req.params.key;
    var value = req.params.value;
    var ttl = req.params.ttl;

    cache.set(key, value, ttl, function(err, value) {
      res.json(value);
    });
  });

  // deletes the cache key
  app.delete('/:key', function(req, res, next) {
    var key = req.params.key;
    
    cache.del(key, function(err) {
      res.json(key + ' was deleted.');
    });
  });

  app.listen(process.env.PORT || 8000);
}
```
