import * as http from 'http';
import {IGameLoader} from '../database/IGameLoader';
import {Route} from './Route';
import {AddressInfo} from 'net';

export interface IHandler {
  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void>;
}

export type Context = {
  url: URL,
  ip: AddressInfo | string,
  route: Route,
  gameLoader: IGameLoader,
  ids: {
    serverId: string,
    statsId: string,
  },
}
