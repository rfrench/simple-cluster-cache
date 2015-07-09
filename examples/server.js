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