(function () {
  "use strict";
  var stage,
      msgLayer,
      layer,
      myColor,
      ws;

  function getRandomColor() {
    var val = hslToRgb(Math.random(), 1.0, 0.5);
    return 'rgb(' + Math.round(val[0]) + 
              ',' + Math.round(val[1]) + 
              ',' + Math.round(val[2]) + ')';
  }

  /*
   * source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   * Converts an HSL (hue saturation lightness) color value to RGB. Conversion 
   * formula adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   */
  function hslToRgb(h, s, l){
      var r, g, b;

      if(s === 0){
          r = g = b = l; // achromatic
      }else{
          var hue2rgb = function (p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          };

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [r * 255, g * 255, b * 255];
  }

  function writeMessage(message) {
    var context = msgLayer.getContext();
    msgLayer.clear();
    context.font = '12pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }

  function drawSpeck(x, y, color) {
    var speck = new Kinetic.Circle({
      x: x,
      y: y,
      radius: 0,
      fill: color
    });
    layer.add(speck);
    speck.tween = new Kinetic.Tween({
      node: speck,
      radius: 75,
      opacity: 0,
      easing: Kinetic.Easings.EaseIn,
      duration: 1,
      onFinish: function () {
        speck.remove();
      }
    });
    speck.tween.play();
  }

  function render() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    // oneSpeck.draw();
    // drawSpeck(250, 250);
  }

  // function gotSpecks(topic, newSpecks) {
  function gotSpecks(topic, speck) {
    // console.log('got speck');
    // console.log('got ' + newSpecks.length + ' new specks');
    // newSpecks.forEach(function (speck) {
      drawSpeck(speck.x, speck.y, speck.color);
    // });
  }
  
  function getSpecks() {
    var specks = stage.get('Circle');
    console.log("there are " + specks.length + " specks");
    // console.log(specks);
  }

  function initKinetic() {
    stage = new Kinetic.Stage({
      container: 'container',
      width: 600,
      height: 600
    });
    layer = new Kinetic.Layer();
    stage.add(layer);
    msgLayer = new Kinetic.Layer();
    stage.add(msgLayer);
    // show mouse position
    // stage.on('mousemove', function () {
    //   var mousePos = stage.getMousePosition();
    //   writeMessage('x: ' + mousePos.x + ', y: ' + mousePos.y);
    // });
    stage.on('mousedown', function () {
      var mousePos = stage.getMousePosition();
      // makeSpeck(mousePos.x, mousePos.y, getRandomColor());
      makeSpeck(mousePos.x, mousePos.y, myColor);
    });
    stage.on('tap', function () {
      var touchPos = stage.getTouchPosition();
      makeSpeck(touchPos.x, touchPos.y, myColor);
    });
  }

  function makeSpeck(x, y, color) {
    if(ws) {
      ws.publish("speck:data", {x: x, y: y, color: color}, true);
    }
    drawSpeck(x, y, color);
  }

  function initWebsockets() {
    var server = location.href.replace('http:', 'ws:') + 'ws';
    ab.connect(server, connect, disconnect);
  }

  function connect(session) {
    console.log('WAMP client connected');
    ws = session;
    document.querySelector('#status').innerHTML = "";
    session.subscribe('speck:data', gotSpecks);
  }

  function disconnect(code, reason) {
    console.log('WAMP client disconnected: ' + code + ": " + reason);
    // document.querySelector('#status').innerHTML = reason;
    document.querySelector('#status').innerHTML = "Disconnected";
  }
  
  function init() {
    myColor = getRandomColor();
    initKinetic();
    initWebsockets();
    // setInterval(getSpecks, 500);
    render();
  }
  window.addEventListener('load', init);
})();
