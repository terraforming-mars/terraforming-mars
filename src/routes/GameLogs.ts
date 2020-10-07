
import * as http from "http";
import * as querystring from "querystring";

import { Game } from "../Game";
import { Route } from "./Route";

export class GameLogs extends Route {
    constructor(private games: Map<string, Game>) {
        super();
    }
    public canHandle(url: string): boolean {
        return url.startsWith("/api/game/logs?");
    }
    public handle(req: http.IncomingMessage, res: http.ServerResponse): void {

        if (req.url === undefined) {
            console.warn("url not defined");
            this.notFound(req, res);
            return;
        }

        const params = querystring.parse(req.url.substring(req.url.indexOf("?") + 1));

        let id = params.id;
        let limit = params.limit;

        if (id === undefined || Array.isArray(id)) {
            this.badRequest(req, res);
            return;
        }

        const game = this.games.get(id);

        if (game === undefined) {
            console.warn("game not found");
            this.notFound(req, res);
            return;
        }

        let log = game.gameLog;

        if (limit !== undefined && !Array.isArray(limit)) {
            const theLimit = parseInt(limit);
            if (isNaN(theLimit)) {
                this.badRequest(req, res);
                return;
            }
            if (log.length > theLimit) {
                log.splice(0, log.length - theLimit);
            }
        }

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(log));
        res.end();
    }
}
