import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeAsset} from './ServeAsset';
import {ApiCreateGame} from './ApiCreateGame';

export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();
  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // Backward compatibility for $lfg, which uses /game to create new games.
  public override put(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    return ApiCreateGame.INSTANCE.post(req, res, ctx);
  }
}
