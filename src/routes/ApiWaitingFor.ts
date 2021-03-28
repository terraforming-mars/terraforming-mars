import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Phase} from '../Phase';
import {Player} from '../Player';
import {WaitingForModel} from '../models/WaitingForModel';

export class ApiWaitingFor extends Handler {
  public static readonly INSTANCE = new ApiWaitingFor();
  private constructor() {
    super();
  }

  private timeToGo(player: Player): boolean {
    return player.getWaitingFor() !== undefined || player.game.phase === Phase.END;
  }

  private getWaitingForModel(player: Player, gameAge: number, undoCount: number): WaitingForModel {
    if (this.timeToGo(player)) {
      return {result: 'GO'};
    } else if (player.game.gameAge > gameAge || player.game.undoCount > undoCount) {
      return {result: 'REFRESH'};
    }
    return {result: 'WAIT'};
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = String(ctx.url.searchParams.get('id'));
    const gameAge = Number(ctx.url.searchParams.get('gameAge'));
    const undoCount = Number(ctx.url.searchParams.get('undoCount'));
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        const etag = `${playerId}:${game.gameAge}:${game.undoCount}`;
        const player = game.getPlayerById(playerId);
        if (req.headers['if-none-match'] === etag && this.timeToGo(player) === false) {
          ctx.route.notModified(res);
          return;
        }
        res.setHeader('Cache-Control', 'must-revalidate');
        res.setHeader('ETag', etag);
        ctx.route.writeJson(res, this.getWaitingForModel(player, gameAge, undoCount));
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${playerId}`, err);
        ctx.route.notFound(req, res, 'player not found');
      }
    });
  }
}
