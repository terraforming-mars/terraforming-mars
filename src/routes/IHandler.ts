import * as http from 'http';
import {IGameLoader} from '../database/IGameLoader';
import {Route} from './Route';

export interface IHandler {
  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void>;
}

export type Context = {
  url: URL,
  route: Route,
  serverId: string,
  gameLoader: IGameLoader,
}
