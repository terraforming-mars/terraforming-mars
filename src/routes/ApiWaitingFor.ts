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

  private getWaitingForModel(player: Player, gameAge: number, undoCount: number): WaitingForModel {
    if (player.getWaitingFor() !== undefined || player.game.phase === Phase.END) {
      return {result: 'GO'};
    } else if (player.game.gameAge > gameAge || player.game.undoCount > undoCount) {
      return {result: 'REFRESH'};
    }
    return {result: 'WAIT'};
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = String(ctx.url.searchParams.get('id'));
    // TODO bafolts remove prev-game-age by 2020-04-01
    const gameAge = Number(ctx.url.searchParams.get('gameAge') ?? ctx.url.searchParams.get('prev-game-age'));
    const undoCount = Number(ctx.url.searchParams.get('undoCount'));
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        ctx.route.writeJson(res, this.getWaitingForModel(game.getPlayerById(playerId), gameAge, undoCount));
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${playerId}`, err);
        ctx.route.notFound(req, res, 'player not found');
      }
    });
  }
}
