Speck
=====

Speck is a small demo to show off [Go][], [turnpike][], [websockets][], [WAMP][], [autobahn.js][]
and [Kinetic.js][].

Users click in a canvas to create "explosions" which are sent to all connected clients with
websockets and displayed in their canvas. The server is written in Go using the turnpike library for
websocket handling. The client uses autobahn.js for websocket handling and kinetic.js for animation.

[go]: http://golang.org/
[turnpike]: https://github.com/jcelliott/turnpike
[websockets]: http://en.wikipedia.org/wiki/WebSocket
[WAMP]: http://wamp.ws/
[autobahn.js]: http://autobahn.ws/js
[kinetic.js]: http://kineticjs.com/

Run it
------

    git clone https://github.com/jcelliott/speck
    cd speck
    export GOPATH=$(pwd)
    go get speck
    go install speck
    bin/speck

* Open your browser to localhost:8080
* Open other browsers to your-ip-address:8080

