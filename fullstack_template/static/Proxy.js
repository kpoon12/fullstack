var httpProxy = require('http-proxy');

  var proxy = httpProxy.createServer({
    target: {
      host: '10.65.4.143',
      port: 180,
      https: true
    }
  }).listen(123);