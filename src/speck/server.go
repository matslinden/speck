package main

import (
	"flag"
	"fmt"
	"gopkg.in/jcelliott/turnpike.v2"
	"log"
	"net/http"
)

var port = flag.String("port", "8080", "port to run the server on")

func main() {
	turnpike.Debug()

	flag.Parse()
	ws := turnpike.NewBasicWebsocketServer("realm1")
	allowAllOrigin := func(r *http.Request) bool { return true }
	ws.Upgrader.CheckOrigin = allowAllOrigin
	http.Handle("/ws", ws)
	http.Handle("/", http.FileServer(http.Dir("web")))

	fmt.Println("Listening on port " + *port)
	if err := http.ListenAndServe(":"+*port, nil); err != nil {
		log.Fatal("Speck:", err)
	}
}
