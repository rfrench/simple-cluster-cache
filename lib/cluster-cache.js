'use strict';

var cluster = require('cluster');
var CacheClient = require('./cache-client');
var CacheClientMaster = require('./cache-client-master');

if (cluster.isMaster) {
  var cache = {};

  // TODO: add domain to stop any errors from crashing master (that would be bad)
  cluster.on('fork', function(worker) {
    worker.on('message', function(msg) {
      if (msg.origin && msg.origin === 'cache-cluster') {
        switch(msg.action)
        {
          case 'get':
            msg.value = cache[msg.key];
            worker.send(msg);
            break;
          case 'set':
            cache[msg.key] = msg.value;
            worker.send(msg);
            break;
          case 'del':
            if (cache[msg.key]) {
              delete cache[msg.key];
            }
            worker.send(msg);
            break;
        }
      }
    });
  });
  module.exports = new CacheClientMaster(cache);
}
else {
  module.exports = new CacheClient();
}