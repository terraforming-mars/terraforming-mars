
var http = require("http");
var Game = require("./src/Game");

var game = new Game("blue");

// Create server for game
var server = http.createServer(function (req, res) {
    if (req.method === "GET") {
        if (req.url === "/") {
            res.write("Routes");
            res.end();
        }
    }
});

server.listen(8080, "0.0.0.0");

