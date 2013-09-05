package main

import (
	"code.google.com/p/go.net/websocket"
	"fmt"
	"github.com/jcelliott/turnpike"
	"log"
	"net/http"
)

func main() {
	s := turnpike.NewServer()
	ws := websocket.Handler(s.HandleWebsocket)
	// http.Handle("/ws", websocket.Handler(s.HandleWebsocket))
	http.Handle("/ws", ws)
	http.Handle("/", http.FileServer(http.Dir("web")))

	fmt.Println("Listening on port 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
