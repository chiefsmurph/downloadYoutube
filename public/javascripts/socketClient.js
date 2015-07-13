
var initSockConnect = function() {

  var sock = new SockJS('http://localhost:9999/echo');

  console.log('init con');

  // Open the connection
  sock.onopen = function() {
    console.log('open connect');
  };

  // On connection close
  sock.onclose = function() {
    console.log('close');
  };

  // On receive message from server
  sock.onmessage = function(e) {
    // Get the content
    var content = JSON.parse(e.data);
    $('#output').html( $('#output').html() + '<br>' + content );
    console.log(content);

  };

  return sock;

}
// Create a connection to http://localhost:9999/echo
