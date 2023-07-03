import * as http from 'http';
import {IGameLoader} from '../database/IGameLoader';
import {Route} from './Route';
import {IPTracker} from '../server/IPTracker';

export interface IHandler {
  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void>;
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
