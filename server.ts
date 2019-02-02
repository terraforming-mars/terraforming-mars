
import * as http from "http";
import * as fs from "fs";
import { Game } from "./src/Game";

const script = fs.readFileSync("dist/script.js");
const games: Map<string, Game> = new Map<string, Game>();

const server: http.Server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse): void {
    
    if (req.method === "GET" && req.url === "/") {
        serveApp(res);
    } else if (req.method === "GET" && req.url === "/j.js") {
        serveScript(res);
    } else if (req.method === "PUT" && req.url && req.url.indexOf("/game") === 0) {
        createGame(req, res);
    } else {
        notFound(res);
    }
});

function createGame(req: http.IncomingMessage, res: http.ServerResponse): void {
    console.log("createGame");
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    });
    req.once("end", function () {
        console.log("create game request", body);
        try {
            const gameReq = JSON.parse(body);
        } catch (err) {
            console.warn("error creating game", err);
            res.writeHead(500);
            res.write("Unable to create game");
        }
        res.end();
    });
}

function notFound(res: http.ServerResponse): void {
    res.writeHead(404);
    res.write("Not found");
    res.end();
}

function serveApp(res: http.ServerResponse): void {
    res.write("<!DOCTYPE html><html><script type='text/javascript' src='j.js'></script><head><title>Teraforming Mars</title><body></body></html>");
    res.end();
}

function serveScript(res: http.ServerResponse): void {
    res.write(script);
    res.end();
}

console.log("Starting server on port 8080");
server.listen(8080);

