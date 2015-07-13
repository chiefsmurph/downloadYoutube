var sockjs = require('sockjs');

var http = require('http');

var echo, server;
var clients;

module.exports = function() {

  // Clients list


  var init = function () {
    clients = {};

    // create sockjs server
    echo = sockjs.createServer();
    // on new connection event
    echo.on('connection', function(conn) {

      // add this client to clients object
      clients[conn.id] = conn;

      console.log('someone connected');

      // on receive new data from client event
      conn.on('data', function(message) {
        console.log(message);
      });

      // on connection close event
      conn.on('close', function() {
        delete clients[conn.id];
      });

    });

    // Create an http server
    server = http.createServer();

    // Integrate SockJS and listen on /echo
    echo.installHandlers(server, {prefix:'/echo'});

    // Start server
    server.listen(9999, '0.0.0.0');

  }

  if (!echo) {
    init();
  }

  // Broadcast to all clients
  var broadcast = function(message){
    // iterate through each client in clients object
    for (var client in clients){
      // send the message to that client
      clients[client].write(JSON.stringify(message));
    }
  }

  return {
    broadcast: broadcast
  };

}
