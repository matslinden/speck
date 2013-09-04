(function () {
  "use strict";
  var canvas,
  context,
  // specks,
  oneSpeck = new Speck(250, 250);

  // TODO: improve this
  function random_color() {
    var letters = '0123456789ABCDEF'.split(''),
        color = '#';
    for (var i=0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  function Speck(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 50;
    this.color = random_color();
  }

  Speck.prototype.draw = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  };

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    oneSpeck.draw();
    console.log("drew one speck");
  }
  
  function connect(session) {
    console.log('WAMP client connected');
    document.querySelector('#content').innerHTML = "WAMP client connected to Turnpike server";
    // session.subscribe('points', displayPoint);
  }

  function disconnect(code, reason) {
    console.log('WAMP client disconnected: ' + code + ": " + reason);
    document.querySelector('#content').innerHTML = "WAMP client disconnected: " + reason + " (" + code + ")";
  }

  function initCanvas() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    render();
  }

  function initWebsockets() {
    var server = location.href.replace('http:', 'ws:') + 'ws';
    ab.connect(server, connect, disconnect);
  }
  
  function init() {
    initCanvas();
    initWebsockets();
  }
  window.addEventListener('load', init);

})();
