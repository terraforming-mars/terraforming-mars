import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Phase} from '../common/Phase';
import {Player} from '../Player';
import {WaitingForModel} from '../common/models/WaitingForModel';
import {Game} from '../Game';
import {isPlayerId, isSpectatorId} from '../common/utils/utils';

export class ApiWaitingFor extends Handler {
  public static readonly INSTANCE = new ApiWaitingFor();
  private constructor() {
    super();
  }

  private timeToGo(player: Player): boolean {
    return player.getWaitingFor() !== undefined || player.game.phase === Phase.END;
  }

  // When player is undefined, caller is a spectator.
  private getPlayerWaitingForModel(player: Player, game: Game, gameAge: number, undoCount: number): WaitingForModel {
    if (this.timeToGo(player)) {
      return {result: 'GO'};
    } else if (game.gameAge > gameAge || game.undoCount > undoCount) {
      return {result: 'REFRESH'};
    }
    return {result: 'WAIT'};
  }

  private getSpectatorWaitingForModel(game: Game, gameAge: number, undoCount: number): WaitingForModel {
    if (game.gameAge > gameAge || game.undoCount > undoCount) {
      return {result: 'REFRESH'};
    }
    return {result: 'WAIT'};
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const id = String(ctx.url.searchParams.get('id'));
    const gameAge = Number(ctx.url.searchParams.get('gameAge'));
    const undoCount = Number(ctx.url.searchParams.get('undoCount'));
    const loader = isPlayerId(id) ? ctx.gameLoader.getByPlayerId : ctx.gameLoader.getBySpectatorId;

    loader.call(ctx.gameLoader, id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        if (isPlayerId(id)) {
          ctx.route.writeJson(res, this.getPlayerWaitingForModel(game.getPlayerById(id), game, gameAge, undoCount));
        } else if (isSpectatorId(id)) {
          ctx.route.writeJson(res, this.getSpectatorWaitingForModel(game, gameAge, undoCount));
        } else {
          ctx.route.internalServerError(req, res, 'id not found');
        }
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${id}`, err);
        ctx.route.notFound(req, res, 'player not found');
      }
    });
  }
}
