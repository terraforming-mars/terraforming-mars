import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Phase} from '../Phase';
import {Player} from '../Player';
import {WaitingForModel} from '../models/WaitingForModel';
import {Game} from '@/Game';

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

  // When player is undefined, caller is a spectator.
  private getSpectatorWaitingForModel(game: Game, gameAge: number, undoCount: number): WaitingForModel {
    if (game.gameAge > gameAge || game.undoCount > undoCount) {
      return {result: 'REFRESH'};
    }
    return {result: 'WAIT'};
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const id = String(ctx.url.searchParams.get('id'));
    const gameAge = Number(ctx.url.searchParams.get('gameAge'));
    const undoCount = Number(ctx.url.searchParams.get('undoCount'));
    const loader = id.charAt(0) === 'p' ? ctx.gameLoader.getByPlayerId : ctx.gameLoader.getBySpectatorId;

    loader.call(ctx.gameLoader, id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        const player = id.charAt(0) === 'p' ? game.getPlayerById(id) : undefined;
        if (player !== undefined) {
          ctx.route.writeJson(res, this.getPlayerWaitingForModel(player, game, gameAge, undoCount));
        } else {
          ctx.route.writeJson(res, this.getSpectatorWaitingForModel(game, gameAge, undoCount));
        }
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${id}`, err);
        ctx.route.notFound(req, res, 'player not found');
      }
    });
  }
}
