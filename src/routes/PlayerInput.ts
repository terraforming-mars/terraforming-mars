import * as http from 'http';
import {GameLoader} from '../database/GameLoader';
import {Player} from '../Player';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class PlayerInput extends Handler {
  private constructor() {
    super();
  }

  public static newInstance(): PlayerInput {
    const handler = new PlayerInput();
    return handler;
  }

  public post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    // I made this req.url! We know at this point url is not null. But moving to using ctx.url will help.
    const playerId: string = req.url!.substring(
      '/player/input?id='.length,
    );
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
      this.processInput(req, res, player);
    });
  }

  private processInput(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    player: Player,
  ): void {
    let body = '';
    req.on('data', (data) => {
      body += data.toString();
    });
    req.once('end', () => {
      try {
        const entity = JSON.parse(body);
        player.process(entity);
        res.setHeader('Content-Type', 'application/json');
        res.write(super.getPlayerModelJSON(player));
        res.end();
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
