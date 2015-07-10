'use strict';

var cluster = require('cluster');
var cache = require('./cache');
var CacheClient = require('./cache-client');

if (cluster.isMaster) {
  cluster.on('fork', function(worker) {
    worker.on('message', function(msg) {
      if (msg.origin && msg.origin === 'cache-cluster') {
        switch(msg.action)
        {
          case 'get':
            msg.value = cache.get(msg.key);
            worker.send(msg);
            break;
          case 'set':
            cache.set(msg.key, msg.value, msg.ttl);
            worker.send(msg);
            break;
          case 'del':
            cache.del(msg.key);
            worker.send(msg);
            break;
          case 'clear':
            cache.clear();
            worker.send(msg);
            break;
        }
      }
    });
  });
}

module.exports = new CacheClient(cluster.isMaster, cache);
