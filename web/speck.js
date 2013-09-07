(function () {
  "use strict";
  var stage,
      msgLayer,
      layer;

  // TODO: improve this
  function random_color() {
    var letters = '0123456789ABCDEF'.split(''),
        color = '#';
    for (var i=0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  function writeMessage(msgLayer, message) {
    var context = msgLayer.getContext();
    msgLayer.clear();
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }

  function drawSpeck(x, y) {
    var speck = new Kinetic.Circle({
      x: x,
      y: y,
      radius: 3,
      fill: random_color()
    });
    layer.add(speck);
    speck.tween = new Kinetic.Tween({
      node: speck,
      scaleX: 30,
      scaleY: 30,
      opacity: 0,
      easing: Kinetic.Easings.EaseIn,
      duration: 1,
      onFinish: function () {
        speck.remove();
      }
    });
    speck.tween.play();
    console.log("drew one speck");
  }

  function render() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    // oneSpeck.draw();
    // drawSpeck();
  }
  
  function connect(session) {
    console.log('WAMP client connected');
    document.querySelector('#status').innerHTML = "WAMP client connected to Turnpike server";
    // session.subscribe('specks', gotSpecks);
  }

  function disconnect(code, reason) {
    console.log('WAMP client disconnected: ' + code + ": " + reason);
    document.querySelector('#status').innerHTML = "WAMP client disconnected: " + reason + " (" + code + ")";
  }

  function getSpecks() {
    var specks = stage.get('Circle');
    console.log("there are " + specks.length + " specks");
    // console.log(specks);
  }

  function initKinetic() {
    stage = new Kinetic.Stage({
      container: 'container',
      width: 500,
      height: 500
    });
    layer = new Kinetic.Layer();
    stage.add(layer);
    msgLayer = new Kinetic.Layer();
    stage.add(msgLayer);
    console.log("init kinetic");
    stage.on('mousemove', function () {
      var mousePos = stage.getMousePosition();
      writeMessage(msgLayer, 'x: ' + mousePos.x + ', y: ' + mousePos.y);
    });
    // TODO: add support for touch devices
    stage.on('mousedown', function () {
      var mousePos = stage.getMousePosition();
      drawSpeck(mousePos.x, mousePos.y);
    });
  }

  function initWebsockets() {
    var server = location.href.replace('http:', 'ws:') + 'ws';
    ab.connect(server, connect, disconnect);
  }
  
  function init() {
    initKinetic();
    initWebsockets();
    // setInterval(getSpecks, 500);
    render();
  }
  window.addEventListener('load', init);
})();
