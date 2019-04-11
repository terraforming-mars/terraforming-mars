
import * as http from "http";
import * as fs from "fs";
import { Game } from "./src/Game";
import { Player } from "./src/Player";
import { SpaceModel } from "./src/models/SpaceModel";
import { ISpace } from "./src/ISpace";
import { PlayerInput } from "./src/PlayerInput";
import { PlayerModel } from "./src/models/PlayerModel";
import { PlayerInputModel } from "./src/models/PlayerInputModel";
import { PlayerInputTypes } from "./src/PlayerInputTypes";
import { AndOptions } from "./src/inputs/AndOptions";
import { OrOptions } from "./src/inputs/OrOptions";
import { SelectCard } from "./src/inputs/SelectCard";
import { SelectHowToPay } from "./src/inputs/SelectHowToPay";
import { SelectPlayer } from "./src/inputs/SelectPlayer";
import { SelectSpace } from "./src/inputs/SelectSpace";
import { ICard } from "./src/cards/ICard";

const styles = fs.readFileSync("styles.css");
const nes = fs.readFileSync("nes.min.css");
const cursor = fs.readFileSync("assets/cursor.png");
const cursorClick = fs.readFileSync("assets/cursor-click.png");
const favicon = fs.readFileSync("favicon.ico");
const games: Map<string, Game> = new Map<string, Game>();
const playersToGame: Map<string, Game> = new Map<string, Game>();

const server: http.Server = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.method === "GET" && req.url && (
            req.url === "/" ||
            req.url.startsWith("/game?id=") ||
            req.url.startsWith("/player?id="))) {
        serveApp(res);
    } else if (req.method === "GET" && req.url !== undefined && req.url.startsWith("/api/player?id=")) {
        apiGetPlayer(req, res);        
    } else if (req.method === "GET" && req.url === "/nes.min.css") {
        serveStyle(res, nes);
    } else if (req.method === "GET" && req.url === "/styles.css") {
        serveStyle(res, styles);
    } else if (req.method === "GET" && req.url === "/main.js") {
        serveScript(res, fs.readFileSync("dist/main.js"));
    } else if (req.method === "GET" && req.url === "/assets/cursor.png") {
        servePng(res, cursor);
    } else if (req.method === "GET" && req.url === "/assets/cursor-click.png") {
        servePng(res, cursorClick);
    } else if (req.method === "GET" && req.url === "/favicon.ico") {
        serveFavicon(res);
    } else if (req.method === "GET" && req.url && req.url.indexOf("/api/game") === 0) {
        apiGetGame(req, res);
    } else if (req.method === "PUT" && req.url && req.url.indexOf("/game") === 0) {
        createGame(req, res);
    } else if (req.method === "POST" && req.url && req.url.indexOf("/player/input?id=") === 0) {
        const playerId: string = req.url.substring("/player/input?id=".length);
        const game = playersToGame.get(playerId);
        if (game === undefined) {
            notFound(req, res);
            return;
        }
        const player = game.getPlayers().filter((player) => player.id === playerId)[0];
        if (player === undefined) {
            notFound(req, res);
            return;
        }
        processInput(req, res, player, game);
    } else {
        notFound(req, res);
    }
});

function generateRandomGameId(): string {
    return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

function processInput(req: http.IncomingMessage, res: http.ServerResponse, player: Player, game: Game): void {
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    });
    req.once("end", function () {
        try {
            const entity = JSON.parse(body);
            player.process(entity);
            res.setHeader("Content-Type", "application/json");
            res.write(getPlayer(player, game));
            res.end();
        } catch (err) {
            res.writeHead(500);
            console.warn("Error processing input from player", err);
            res.end();
        }
    });
}

function apiGetGame(req: http.IncomingMessage, res: http.ServerResponse): void {
    const routeRegExp: RegExp = /^\/api\/game\?id\=([0-9abcdef]+)$/i;

    if (req.url === undefined) {
        console.warn("url not defined");
        notFound(req, res);
        return;
    }

    if (!routeRegExp.test(req.url)) {
        console.warn("no match with regexp");
        notFound(req, res);
        return;
    }

    const matches = req.url.match(routeRegExp);

    if (matches === null || matches[1] === undefined) {
        console.warn("didn't find game id");
        notFound(req, res);
        return;
    }

    const gameId: string = matches[1];

    const game = games.get(gameId);

    if (game === undefined) {
        console.warn("game is undefined");
        notFound(req, res);
        return;
    }

    res.setHeader("Content-Type", "application/json");
    res.write(getGame(game));
    res.end();
}

function apiGetPlayer(req: http.IncomingMessage, res: http.ServerResponse): void {
        const playerId: string = req.url!.substring("/api/player?id=".length);
        const game = playersToGame.get(playerId);
        if (game === undefined) {
            notFound(req, res);
            return;
        }
        const player = game.getPlayers().filter((player) => player.id === playerId)[0];
        if (player === undefined) {
            notFound(req, res);
            return;
        }

    res.setHeader("Content-Type", "application/json");
    res.write(getPlayer(player, game));
    res.end();
}

function createGame(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    });
    req.once("end", function () {
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
            game.getPlayers().forEach((player) => {
                playersToGame.set(player.id, game);
            });
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

function getPlayer(player: Player, game: Game): string {
    const output = {
        cardsInHand: player.cardsInHand.map((card) => card.name),
        claimedMilestones: game.claimedMilestones.map((claimedMilestone) => { return { player: claimedMilestone.player.id, milestone: claimedMilestone.milestone } }),
        color: player.color,
        corporationCard: player.corporationCard ? player.corporationCard.name : undefined,
        energy: player.energy,
        energyProduction: player.energyProduction,
        fundedAwards: game.fundedAwards.map((fundedAward) => { return { player: fundedAward.player.id, award: fundedAward.award } }),
        generation: game.getGeneration(),
        heat: player.heat,
        heatProduction: player.heatProduction,
        id: player.id,
        megaCredits: player.megaCredits,
        megaCreditProduction: player.megaCreditProduction,
        name: player.name,
        oceans: game.getOceansOnBoard(),
        oxygenLevel: game.getOxygenLevel(),
        plants: player.plants,
        plantProduction: player.plantProduction,
        playedCards: player.playedCards.map((card) => card.name),
        players: getPlayers(game.getPlayers()),
        spaces: getSpaces(game.getAllSpaces()),
        steel: player.steel,
        steelProduction: player.steelProduction,
        temperature: game.getTemperature(),
        terraformRating: player.terraformRating,
        titanium: player.titanium,
        titaniumProduction: player.titaniumProduction,
        waitingFor: getWaitingFor(player.getWaitingFor())
    };
    return JSON.stringify(output);
}

function getWaitingFor(waitingFor: PlayerInput | undefined): PlayerInputModel | undefined {
    if (waitingFor === undefined) {
        return undefined;
    }
    const result: PlayerInputModel = {
        title: waitingFor.title,
        message: waitingFor.message,
        inputType: waitingFor.inputType,
        options: undefined,
        cards: undefined,
        maxCardsToSelect: undefined,
        minCardsToSelect: undefined,
        canUseSteel: undefined,
        canUseTitanium: undefined,
        canUseHeat: undefined,
        players: undefined,
        availableSpaces: undefined
    };
    switch (waitingFor.inputType) {
        case PlayerInputTypes.AND_OPTIONS:
        case PlayerInputTypes.OR_OPTIONS:
            result.options = [];
            for (const option of (waitingFor as AndOptions | OrOptions).options) {
                const subOption = getWaitingFor(option);
                if (subOption !== undefined) {
                    result.options.push(subOption);
                }
            }
        break;
        case PlayerInputTypes.SELECT_CARD:
            result.cards = (waitingFor as SelectCard<ICard>).cards.map((card) => card.name);
            result.maxCardsToSelect = (waitingFor as SelectCard<ICard>).maxCardsToSelect;
            result.minCardsToSelect = (waitingFor as SelectCard<ICard>).minCardsToSelect;
        break;
        case PlayerInputTypes.SELECT_HOW_TO_PAY:
            result.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
            result.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
            result.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
        break;
        case PlayerInputTypes.SELECT_PLAYER:
            result.players = (waitingFor as SelectPlayer).players.map((player) => player.id);
        break;
        case PlayerInputTypes.SELECT_SPACE:
            result.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map((space) => space.id);
        break;
    }
    return result;
}

function getPlayers(players: Array<Player>): Array<PlayerModel> {
    return players.map((player) => {
        return {
            id: player.id,
            name: player.name,
            color: player.color
        };
    }); 
}

function getSpaces(spaces: Array<ISpace>): Array<SpaceModel> {
    return spaces.map((space) => {
        return {
            x: space.x,
            y: space.y,
            id: space.id,
            bonus: space.bonus,
            spaceType: space.spaceType,
            tileType: space.tile && space.tile.tileType,
            color: space.player && space.player.color
        };
    });
}

function getGame(game: Game): string {
    const output = {
        id: game.id,
        activePlayer: game.activePlayer.color,
        phase: game.phase,
        ended: game.ended,
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
    res.write(fs.readFileSync("index.html"));
    res.end();
}

function serveFavicon(res: http.ServerResponse): void {
    res.setHeader("Content-Type", "image/x-icon");
    res.write(favicon);
    res.end();
}

function serveStyle(res: http.ServerResponse, s: Buffer): void {
    res.write(s);
    res.end();
}

function serveScript(res: http.ServerResponse, s: Buffer): void {
    res.write(s);
    res.end();
}

function servePng(res: http.ServerResponse, s: Buffer): void {
    res.setHeader("Content-Type", "image/png");
    res.write(s);
    res.end();
}

console.log("Starting server on port " + (process.env.PORT || 8080));
server.listen(process.env.PORT || 8080);

