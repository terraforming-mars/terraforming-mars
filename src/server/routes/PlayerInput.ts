import * as responses from './responses';
import {IPlayer} from '../IPlayer';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {OrOptions} from '../inputs/OrOptions';
import {UndoActionOption} from '../inputs/UndoActionOption';
import {InputResponse} from '../../common/inputs/InputResponse';
import {isPlayerId} from '../../common/Types';
import {Request} from '../Request';
import {Response} from '../Response';
import {runId} from '../utils/server-ids';
import {AppError} from '../server/AppError';
import {statusCode} from '../../common/http/statusCode';

export class PlayerInput extends Handler {
  public static readonly INSTANCE = new PlayerInput();
  private constructor() {
    super();
  }

  public override async post(req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.url.searchParams.get('id');
    if (playerId === null) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }

    if (!isPlayerId(playerId)) {
      responses.badRequest(req, res, 'invalid player id');
      return;
    }

    ctx.ipTracker.addParticipant(playerId, ctx.ip);

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      responses.notFound(req, res);
      return;
    }
    let player: IPlayer | undefined;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      responses.notFound(req, res);
      return;
    }
    return this.processInput(req, res, ctx, player);
  }

  private isWaitingForUndo(player: IPlayer, entity: InputResponse): boolean {
    const waitingFor = player.getWaitingFor();
    if (entity.type === 'or' && waitingFor instanceof OrOptions) {
      const idx = entity.index;
      return waitingFor.options[idx] instanceof UndoActionOption;
    }
    return false;
  }

  private async performUndo(_req: Request, res: Response, ctx: Context, player: IPlayer): Promise<void> {
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
    } catch (err) {
      console.error(err);
    }
    responses.writeJson(res, Server.getPlayerModel(player));
  }

  private processInput(req: Request, res: Response, ctx: Context, player: IPlayer): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (data) => {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const entity = JSON.parse(body);
          validateRunId(entity);
          if (this.isWaitingForUndo(player, entity)) {
            await this.performUndo(req, res, ctx, player);
          } else {
            player.process(entity);
            responses.writeJson(res, Server.getPlayerModel(player));
          }
          resolve();
        } catch (e) {
          if (!(e instanceof AppError)) {
            console.warn('Error processing input from player', e);
          }
          // TODO(kberg): use responses.ts, though that changes the output.
          res.writeHead(statusCode.badRequest, {
            'Content-Type': 'application/json',
          });

          const id = e instanceof AppError ? e.id : undefined;
          const message = e instanceof Error ? e.message : String(e);
          res.write(JSON.stringify({id: id, message: message}));
          res.end();
          resolve();
        }
      });
    });
  }
}
function validateRunId(entity: any) {
  if (entity.runId !== undefined && runId !== undefined) {
    if (entity.runId !== runId) {
      throw new AppError('#invalid-run-id', 'The server has restarted. Click OK to refresh this page.');
    }
  }
  // Clearing this out to be compatible with the input response processors.
  delete entity.runId;
}

