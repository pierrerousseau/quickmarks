// Generated by CoffeeScript 1.3.3
var americano, port;

require('nodetime').profile({
  accountKey: 'a185eba740a6c99721a956d4e5f61dc81ad1ab50',
  appName: 'Bookmark'
});

americano = require('americano');

port = process.env.PORT || 9250;

americano.start({
  name: 'Bookmark',
  port: port
});

setInterval(function() {
  return console.log(process.memoryUsage());
}, 2000);
