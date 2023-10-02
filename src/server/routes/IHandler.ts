import {IGameLoader} from '../database/IGameLoader';
import {Route} from './Route';
import {IPTracker} from '../server/IPTracker';
import {Request} from '../Request';
import {Response} from '../Response';

export interface IHandler {
  processRequest(req: Request, res: Response, ctx: Context): Promise<void>;
}

export type Context = {
  url: URL,
  ip: string,
  route: Route,
  gameLoader: IGameLoader,
  ipTracker: IPTracker,
  ids: {
    serverId: string,
    statsId: string,
  },
}
