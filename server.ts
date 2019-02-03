
import * as http from "http";
import * as fs from "fs";
import { Game } from "./src/Game";
import { Player } from "./src/Player";

const script = fs.readFileSync("dist/script.js");
const favicon = fs.readFileSync("favicon.ico");
const games: Map<string, Game> = new Map<string, Game>();

const server: http.Server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse): void {
    
    if (req.method === "GET" && req.url === "/") {
        serveApp(res);
    } else if (req.method === "GET" && req.url === "/j.js") {
        serveScript(res);
    } else if (req.method === "PUT" && req.url && req.url.indexOf("/game") === 0) {
        createGame(req, res);
    } else if (req.method === "GET" && req.url === "/favicon.ico") {
        serveFavicon(res);
    } else {
        notFound(res);
    }
});

function generateRandomGameId(): string {
    return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

function createGame(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    });
    req.once("end", function () {
        console.log("create game request", body);
        try {
            const gameReq = JSON.parse(body);
            const gameId = generateRandomGameId();
            const players = gameReq.players.map((obj: any) => {
                return new Player(obj.name, obj.color, obj.beginner);
            });
            let firstPlayer = players[0];
            for (let i = 0; i < gameReq.players.length; i++) {
                if (gameReq.players[i].first === true) {
                    firstPlayer = players[i];
                    break;
                }
            }
            const game = new Game(gameId, players, firstPlayer);
            games.set(gameId, game);
            res.setHeader("Content-Type", "application/json");
            res.write(getGame(game)); 
        } catch (err) {
            console.warn("error creating game", err);
            res.writeHead(500);
            res.write("Unable to create game");
        }
        res.end();
    });
}

function getGame(game: Game): string {
    const output = {
        id: game.id,
        activePlayer: game.activePlayer.color,
        phase: game.phase
    };
    return JSON.stringify(output);
}

function notFound(res: http.ServerResponse): void {
    res.writeHead(404);
    res.write("Not found");
    res.end();
}

function serveApp(res: http.ServerResponse): void {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<!DOCTYPE html><html><script type='text/javascript' src='j.js'></script><head><title>Teraforming Mars</title><body></body></html>");
    res.end();
}

function serveFavicon(res: http.ServerResponse): void {
    res.setHeader("Content-Type", "image/x-icon");
    res.write(favicon);
    res.end();
}

function serveScript(res: http.ServerResponse): void {
    res.write(script);
    res.end();
}

console.log("Starting server on port 8080");
server.listen(8080);

