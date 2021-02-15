import * as http from 'http';
import {Route} from '../../routes/Route';

export interface IHandler {
  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void;
}

export interface IContext {
  url: URL,
  route: Route,
};
