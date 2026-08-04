import * as responses from '../server/responses';
import prometheus from 'prom-client';
import {IPlayer} from '../IPlayer';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {OrOptions} from '../inputs/OrOptions';
import {UndoActionOption} from '../inputs/UndoActionOption';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Request} from '../Request';
import {Response} from '../Response';
import {runId} from '../utils/server-ids';
import {AppError} from '../server/AppError';
import {InputError} from '../inputs/InputError';
import {isIProjectCard} from '../cards/IProjectCard';
import {INVALID_RUN_ID, RESPONDING_TOO_QUICKLY} from '../../common/app/AppErrorId';
import {RouteError} from './RouteError';
import {readBody} from './readBody';
import {stringToNumber} from '../database/utils';

export const playerInputMetrics = {
  responseInterval: new prometheus.Histogram({
    name: 'player_input_response_interval',
    help: 'Time a user takes to respond to an input request',
    buckets: [50, 100, 250, 500, 1000, 2000, 5000, 10000, 30000, 60000, 300000],
    registers: [prometheus.register],
  }),
};

export class PlayerInput extends Handler {
  public static readonly INSTANCE = new PlayerInput();

  public constructor(private readonly minResponseIntervalMs = stringToNumber(process.env.MIN_RESPONSE_INTERVAL_MS, 0)) {
    super();
  }

  public override async post(req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.urlParams.playerId('id');

    ctx.ipTracker.addParticipant(playerId, ctx.ip);

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      throw RouteError.notFound();
    }
    let player: IPlayer;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
      throw RouteError.notFound();
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
    responses.writeJson(res, ctx, Server.getPlayerModel(player));
  }

  private async processInput(req: Request, res: Response, ctx: Context, player: IPlayer): Promise<void> {
    const responseInterval = this.responseInterval(player, ctx);
    const body = await readBody(req);
    this.observeResponseInterval(responseInterval);
    try {
      if (this.isRespondingTooQuickly(responseInterval)) {
        throw new AppError(RESPONDING_TOO_QUICKLY, "You're responding a little too quickly.");
      }
      const entity = JSON.parse(body);
      validateRunId(entity);

      // Placed here because it fits in a temporally cohesive sense.
      this.resetTableauCardState(player);

      if (this.isWaitingForUndo(player, entity)) {
        await this.performUndo(req, res, ctx, player);
      } else {
        player.process(entity);
        responses.writeJson(res, ctx, Server.getPlayerModel(player));
      }
    } catch (e) {
      if (!(e instanceof AppError || e instanceof InputError)) {
        console.warn('Error processing input from player', e);
      }
      responses.badInputRequest(req, res, e);
    }
  }

  // TODO(kberg): Find a better place for this optimization.
  private resetTableauCardState(player: IPlayer): void {
    for (const card of player.tableau) {
      card.clearWarnings();
      if (isIProjectCard(card)) {
        card.additionalProjectCosts = undefined;
      }
    }
  }

  private responseInterval(player: IPlayer, ctx: Context): number | undefined {
    if (player.inputRequestedAt === undefined) {
      return undefined;
    }
    return ctx.clock.now() - player.inputRequestedAt;
  }

  private observeResponseInterval(responseInterval: number | undefined): void {
    if (responseInterval !== undefined) {
      playerInputMetrics.responseInterval.observe(responseInterval);
    }
  }

  private isRespondingTooQuickly(responseInterval: number | undefined): boolean {
    if (this.minResponseIntervalMs <= 0) {
      return false;
    }
    if (responseInterval === undefined) {
      return false;
    }
    return responseInterval < this.minResponseIntervalMs;
  }
}
function validateRunId(entity: any) {
  if (entity.runId !== undefined && runId !== undefined) {
    if (entity.runId !== runId) {
      throw new AppError(INVALID_RUN_ID, 'The server has restarted. Click OK to refresh this page.');
    }
  }
  // Clearing this out to be compatible with the input response processors.
  delete entity.runId;
}

