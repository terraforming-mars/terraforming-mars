import * as http from 'http';
import {escape} from 'html-escaper';

export class Route {
  public badRequest(req: http.IncomingMessage, res: http.ServerResponse, err?: string): void {
    console.warn('bad request', req.url);
    res.writeHead(400);
    res.write('Bad request');
    if (err) {
      res.write(': ');
      res.write(err);
    }
    res.end();
  }
  public notFound(req: http.IncomingMessage, res: http.ServerResponse, err?: string): void {
    if (!process.argv.includes('hide-not-found-warnings')) {
      console.warn('Not found', req.method, req.url);
    }
    res.writeHead(404);
    res.write('Not found');
    if (err) {
      res.write(': ');
      res.write(err);
    }
    res.end();
  }
  public notModified(res: http.ServerResponse): void {
    res.writeHead(304);
    res.end();
  }
  public internalServerError(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    err: unknown): void {
    console.warn('internal server error: ', req.url, err);
    res.writeHead(500);

    res.write('Internal server error: ');

    if (err instanceof Error) {
      res.write(escape(err.message));
    } else if (typeof(err) === 'string') {
      res.write(escape(err));
    } else {
      res.write('unknown error');
    }

    res.end();
  }
  public notAuthorized(req: http.IncomingMessage, res: http.ServerResponse): void {
    console.warn('Not authorized', req.method, req.url);
    res.writeHead(403);
    res.write('Not authorized');
    res.end();
  }
  public writeJson(res: http.ServerResponse, json: any) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
  }
}
