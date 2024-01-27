import {IGameLoader} from '../database/IGameLoader';
import {IPTracker} from '../server/IPTracker';
import {Request} from '../Request';
import {Response} from '../Response';
import {Clock} from '../../common/Timer';

export interface IHandler {
  processRequest(req: Request, res: Response, ctx: Context): Promise<void>;
}

export type Context = {
  url: URL,
  ip: string,
  gameLoader: IGameLoader,
  ipTracker: IPTracker,
  ids: {
    serverId: string,
    statsId: string,
  },
  clock: Clock;
}
