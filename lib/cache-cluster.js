var cluster = require('cluster');

if (cluster.isMaster) {
  var cache = {};

  cluster.on('fork', function(worker) {
    worker.on('message', function(msg) {
      if (msg.origin && msg.origin === 'cache-cluster') {
        switch(msg.action)
        {
          case 'get':
            msg.value = value;
            worker.send(msg);
            break;
          case 'set':
            cache[msg.key] = msg.value;
            worker.send(msg);
            break;
        }
      }
    });
  });
}