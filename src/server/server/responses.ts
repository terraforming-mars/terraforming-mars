import {escape} from 'html-escaper';
import {Context} from '../routes/IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {statusCode} from '../../common/http/statusCode';

export function badRequest(req: Request, res: Response, err?: string): void {
  console.warn('bad request', req.url);
  res.writeHead(statusCode.badRequest);
  res.write('Bad request');
  if (err) {
    res.write(': ');
    res.write(err);
  }
  res.end();
}

export function notFound(req: Request, res: Response, err?: string): void {
  if (!process.argv.includes('hide-not-found-warnings')) {
    console.warn('Not found', req.method, req.url);
  }
  res.writeHead(statusCode.notFound);
  res.write('Not found');
  if (err) {
    res.write(': ');
    res.write(err);
  }
  res.end();
}

export function notModified(res: Response): void {
  res.writeHead(statusCode.notModified);
  res.end();
}

export function internalServerError(
  req: Request,
  res: Response,
  err: unknown): void {
  console.warn('internal server error: ', req.url, err);
  res.writeHead(statusCode.internalServerError);

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

export function notAuthorized(req: Request, res: Response): void {
  console.warn('Not authorized', req.method, req.url);
  res.writeHead(statusCode.forbidden);
  res.write('Not authorized');
  res.end();
}

export function downgradeRedirect(_req: Request, res: Response, ctx: Context): void {
  const url = new URL(ctx.url); // defensive copty
  url.searchParams.set('serverId', ctx.ids.statsId);
  res.writeHead(statusCode.movedPermanently, {Location: url.pathname + url.search});
  res.end();
}

export function writeJson(res: Response, json: any, space?: string | number | undefined) {
  res.setHeader('Content-Type', 'application/json');
  const s = JSON.stringify(json, undefined, space);
  res.end(s);
}

export function quotaExceeded(req: Request, res: Response) {
  console.warn('Quota exceeded for', req.method, req.url);
  res.writeHead(statusCode.tooManyRequests);
  res.write('Quota exceeded');
  res.end();
}

