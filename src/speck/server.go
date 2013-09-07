package main

import (
	"code.google.com/p/go.net/websocket"
	"flag"
	"fmt"
	"github.com/jcelliott/turnpike"
	"log"
	"net/http"
)

var port = flag.String("port", "8080", "port to run the server on")

func main() {
	flag.Parse()
	s := turnpike.NewServer()
	ws := websocket.Handler(s.HandleWebsocket)
	http.Handle("/ws", ws)
	http.Handle("/", http.FileServer(http.Dir("web")))

	fmt.Println("Listening on port " + *port)
	if err := http.ListenAndServe(":"+*port, nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
