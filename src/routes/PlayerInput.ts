import * as http from 'http';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {OrOptions} from '../inputs/OrOptions';
import {UndoActionOption} from '../inputs/UndoActionOption';
import {InputResponse} from '../common/inputs/InputResponse';

export class PlayerInput extends AsyncHandler {
  public static readonly INSTANCE = new PlayerInput();
  private constructor() {
    super();
  }

  public override async post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const playerId = ctx.url.searchParams.get('id');

    if (playerId === null) {
      ctx.route.badRequest(req, res, 'must provide player id');
      return Promise.resolve();
    }

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    const game = await ctx.gameLoader.getByParticipantIdAsync(playerId);
    let player: Player | undefined;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      ctx.route.notFound(req, res);
      return Promise.resolve();
    }
    return this.processInput(req, res, ctx, player);
  }

  private isWaitingForUndo(player: Player, entity: InputResponse): boolean {
    const waitingFor = player.getWaitingFor();
    return entity.length > 0 && entity[0].length > 0 &&
           waitingFor instanceof OrOptions && waitingFor.options[Number(entity[0][0])] instanceof UndoActionOption;
  }

  private async performUndo(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext, player: Player): Promise<void> {
    /**
     * The `lastSaveId` property is incremented during every `takeAction`.
     * The first save being decremented is the increment during `takeAction` call
     * The second save being decremented is the action that was taken
     */
    const lastSaveId = player.game.lastSaveId - 2;
    try {
      const game = await ctx.gameLoader.restoreGameAt(player.game.id, lastSaveId);
      if (game === undefined) {
        player.game.log('Unable to perform undo operation. Error retrieving game from database. Please try again.', () => {}, {reservedFor: player});
      } else {
        // pull most recent player instance
        player = game.getPlayerById(player.id);
      }
      ctx.route.writeJson(res, Server.getPlayerModel(player));
    } catch (err) {
      player.game.log('Unable to perform undo operation. Error retrieving game from database. Please try again.', () => {}, {reservedFor: player});
      ctx.route.internalServerError(req, res, err);
    }
  }

  private processInput(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: IContext,
    player: Player,
  ): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', async (data) => {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const entity = JSON.parse(body);
          if (this.isWaitingForUndo(player, entity)) {
            await this.performUndo(req, res, ctx, player);
          } else {
            player.process(entity);
            ctx.route.writeJson(res, Server.getPlayerModel(player));
          }
          resolve();
        } catch (e) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
          });

          console.warn('Error processing input from player', e);
          const message = e instanceof Error ? e.message : String(e);
          res.write(JSON.stringify({message}));
          res.end();
          resolve();
        }
      });
    });
  }
}
