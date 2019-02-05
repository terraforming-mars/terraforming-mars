
import * as http from "http";
import * as fs from "fs";
import { Game } from "./src/Game";
import { Player } from "./src/Player";
import { SpaceType } from "./src/SpaceType";

const script = fs.readFileSync("dist/script.js");
const favicon = fs.readFileSync("favicon.ico");
const games: Map<string, Game> = new Map<string, Game>();

const server: http.Server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.method === "GET" && req.url === "/") {
        serveApp(res);
    } else if (req.method === "GET" && req.url === "/j.js") {
        serveScript(res);
    } else if (req.method === "GET" && req.url && req.url.indexOf("/game/") === 0) {
        serveGame(req, res);
    } else if (req.method === "PUT" && req.url && req.url.indexOf("/game") === 0) {
        createGame(req, res);
    } else if (req.method === "GET" && req.url === "/favicon.ico") {
        serveFavicon(res);
    } else {
        notFound(req, res);
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
        phase: game.phase,
        spaces: game.getSpaces(SpaceType.LAND).concat(game.getSpaces(SpaceType.COLONY)).concat(game.getSpaces(SpaceType.OCEAN)).map((space) => ({
            id: space.id,
            spaceType: space.spaceType,
            tile: space.tile,
            player: space.player ? space.player.id : undefined,
            bonus: space.bonus,
            x: space.x,
            y: space.y
        })),
        players: game.getPlayers()
    };
    return JSON.stringify(output);
}

function notFound(req: http.IncomingMessage, res: http.ServerResponse): void {
    console.warn("Not found", req.method, req.url);
    res.writeHead(404);
    res.write("Not found");
    res.end();
}

function serveApp(res: http.ServerResponse): void {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<!DOCTYPE html><html><head><script type='text/javascript' src='/j.js'></script><title>Teraforming Mars</title></head><body onload='showCreateGameForm()'></body></html>");
    res.end();
}

function serveGame(req: http.IncomingMessage, res: http.ServerResponse): void {

    const routeRegExp: RegExp = /^\/game\/([0-9abcdef]+)$/i;

    if (req.url === undefined) {
        notFound(req, res);
        return;
    }

    if (!routeRegExp.test(req.url)) {
        notFound(req, res);
        return;
    }

    const matches = req.url.match(routeRegExp);

    if (matches === null || matches[1] === undefined) {
        notFound(req, res);
        return;
    }

    const gameId: string = matches[1];

    if (games.has(gameId) === false) {
        notFound(req, res);
        return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("<!DOCTYPE html><html><head><script type='text/javascript' src='/j.js'></script><title>Teraforming Mars</title></head><body onload='showGameHome()'></body></html>");
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

