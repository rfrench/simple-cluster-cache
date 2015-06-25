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
}
else {
  var app = express();

  // gets the key from cache
  app.get('/:key', function(req, res, next) {
    var key = req.params.key;
    cache.get(key, function(err, value) {
      res.end(value);
    });
  });

  // sets the cache value
  app.post('/:key/:value', function(req, res, next) {
    var key = req.params.key;
    var value = req.params.value;

    cache.set(key, value, function(err, value) {
      res.end(value);
    });
  });

  // deletes the cache key
  app.del('/:key', function(req, res, next) {
    var key = req.params.key;
    
    cache.del(key, function(err) {
      res.end(key + ' was deleted.');
    });
  });

  app.listen(process.env.PORT || 8000);
}