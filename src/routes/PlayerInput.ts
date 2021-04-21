import * as http from 'http';
import {GameLoader} from '../database/GameLoader';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class PlayerInput extends Handler {
  public static readonly INSTANCE = new PlayerInput();
  private constructor() {
    super();
  }

  public post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = ctx.url.searchParams.get('id');

    if (playerId === null) {
      ctx.route.badRequest(req, res, 'must provide id');
      return;
    }

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    GameLoader.getInstance().getByPlayerId(playerId, (game) => {
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
    req.once('end', function() {
      try {
        const entity = JSON.parse(body);
        player.process(entity);
        ctx.route.writeJson(res, Server.getPlayerModel(player));
      } catch (err) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        });
        console.warn('Error processing input from player', err);
        res.write(
          JSON.stringify({
            message: err.message,
          }),
        );
        res.end();
      }
    });
  }
}
