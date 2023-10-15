import {escape} from 'html-escaper';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class Route {
  public badRequest(req: Request, res: Response, err?: string): void {
    console.warn('bad request', req.url);
    res.writeHead(400);
    res.write('Bad request');
    if (err) {
      res.write(': ');
      res.write(err);
    }
    res.end();
  }
  public notFound(req: Request, res: Response, err?: string): void {
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
  public notModified(res: Response): void {
    res.writeHead(304);
    res.end();
  }
  public internalServerError(
    req: Request,
    res: Response,
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
  public notAuthorized(req: Request, res: Response): void {
    console.warn('Not authorized', req.method, req.url);
    res.writeHead(403);
    res.write('Not authorized');
    res.end();
  }

  public downgradeRedirect(_req: Request, res: Response, ctx: Context): void {
    const url = new URL(ctx.url); // defensive copty
    url.searchParams.set('serverId', ctx.ids.statsId);
    res.writeHead(301, {Location: url.pathname + url.search});
    res.end();
  }

  public writeJson(res: Response, json: any, space?: string | number | undefined) {
    res.setHeader('Content-Type', 'application/json');
    const s = JSON.stringify(json, undefined, space);
    res.end(s);
  }
}
