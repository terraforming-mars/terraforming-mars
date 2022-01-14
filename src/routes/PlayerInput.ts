import * as http from 'http';
import {Game} from '../Game';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {OrOptions} from '../inputs/OrOptions';
import {UndoActionOption} from '../inputs/UndoActionOption';

export class PlayerInput extends Handler {
  public static readonly INSTANCE = new PlayerInput();
  private constructor() {
    super();
  }

  public override post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = ctx.url.searchParams.get('id');

    if (playerId === null) {
      ctx.route.badRequest(req, res, 'must provide id');
      return;
    }

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      let player: Player | undefined;
      try {
        player = game.getPlayerById(playerId);
      } catch (err) {
        console.warn(`unable to find player ${playerId}`, err);
      }
      if (player === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      this.processInput(req, res, ctx, player);
    });
  }

  private isWaitingForUndo(player: Player, entity: Array<Array<string>>): boolean {
    const waitingFor = player.getWaitingFor();
    return entity.length > 0 && entity[0].length > 0 &&
           waitingFor instanceof OrOptions && waitingFor.options[Number(entity[0][0])] instanceof UndoActionOption;
  }

  private performUndo(res: http.ServerResponse, ctx: IContext, player: Player): void {
    /**
     * The `lastSaveId` property is incremented during every `takeAction`.
     * The first save being decremented is the increment during `takeAction` call
     * The second save being decremented is the action that was taken
     */
    const lastSaveId = player.game.lastSaveId - 2;
    ctx.gameLoader.restoreGameAt(player.game.id, lastSaveId, (game: Game | undefined) => {
      if (game === undefined) {
        player.game.log('Unable to perform undo operation. Error retrieving game from database. Please try again.', () => {}, {reservedFor: player});
      } else {
        // pull most recent player instance
        player = game.getPlayerById(player.id);
      }
      ctx.route.writeJson(res, Server.getPlayerModel(player));
    });
  }

  private processInput(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: IContext,
    player: Player,
  ): void {
    let body = '';
    req.on('data', function(data) {
      body += data.toString();
    });
    req.once('end', () => {
      try {
        const entity = JSON.parse(body);
        if (this.isWaitingForUndo(player, entity)) {
          this.performUndo(res, ctx, player);
          return;
        }
        player.process(entity);
        ctx.route.writeJson(res, Server.getPlayerModel(player));
      } catch (e) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        });

        console.warn('Error processing input from player', e);
        const message = e instanceof Error ? e.message : String(e);
        res.write(JSON.stringify({message}));
        res.end();
      }
    });
  }
}
