import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';
import {IContext, IHandler} from './IHandler';
import {BufferCache} from '../BufferCache';

export class ServeAsset implements IHandler {
  private readonly cache = new BufferCache();

  private constructor(public assetCacheMaxAge = process.env.ASSET_CACHE_MAX_AGE || 0,
    public isProduction = process.env.NODE_ENV === 'production') {
  }

  public static newInstance() {
    // prime the cache and compress styles.css
    const styles = fs.readFileSync('build/styles.css');
    this.cache.set('styles.css', styles);
    zlib.gzip(styles, (err, compressed) => {
      if (err !== null) {
        console.warn('error compressing styles', err);
        return;
      }
      this.cache.set('styles.css.gz', compressed);
    });
  }
  public processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (req.url === undefined) {
      ctx.route.internalServerError(req, res, new Error('no url on request'));
      return;
    }

    let contentEncoding: string | undefined;
    let contentType: string | undefined;
    let file: string | undefined;

    if (req.url === '/styles.css') {
      const compressed = this.cache.get('styles.css.gz');
      contentType = 'text/css';
      file = 'styles.css';
      if (compressed !== undefined && this.supportsEncoding(req, 'gzip')) {
        contentEncoding = 'gzip';
        file += '.gz';
      }
    } else if (req.url === '/assets/index.html') {
      contentType = 'text/html; charset=utf-8';
      file = req.url.substring(1);
    } else if (req.url === '/favicon.ico') {
      contentType = 'image/x-icon';
      file = 'assets/favicon.ico';
    } else if (req.url === '/main.js' || req.url === '/main.js.map') {
      contentType = 'text/javascript';
      file = `build${req.url}`;
      if (this.supportsEncoding(req, 'br')) {
        contentEncoding = 'br';
        file += '.br';
      } else if (this.supportsEncoding(req, 'gzip')) {
        contentEncoding = 'gzip';
        file += '.gz';
      }
    } else if (req.url === '/assets/Prototype.ttf' || req.url === '/assets/futureforces.ttf') {
      contentType = 'font/ttf';
      file = req.url.substring(1);
    } else if (req.url.endsWith('.png') || req.url.endsWith('.jpg')) {
      const assetsRoot = path.resolve('./assets');
      const reqFile = path.resolve(path.normalize(req.url).slice(1));

      // Disallow to go outside of assets directory
      if (reqFile.startsWith(assetsRoot) === false) {
        return ctx.route.notFound(req, res);
      }
      contentType = req.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
      file = reqFile;
    } else {
      return ctx.route.notFound(req, res);
    }
    // asset caching
    const buffer = this.cache.get(file);
    if (buffer !== undefined) {
      if (req.headers['if-none-match'] === buffer.hash) {
        ctx.route.notModified(res);
        return;
      }
      res.setHeader('Cache-Control', 'must-revalidate');
      res.setHeader('ETag', buffer.hash);
    } else if (this.isProduction === false && req.url !== '/main.js' && req.url !== '/main.js.map') {
      res.setHeader('Cache-Control', 'max-age=' + this.assetCacheMaxAge);
    }

    if (contentType !== undefined) {
      res.setHeader('Content-Type', contentType);
    }

    if (contentEncoding !== undefined) {
      res.setHeader('Content-Encoding', contentEncoding);
    }

    if (buffer !== undefined) {
      res.setHeader('Content-Length', buffer.buffer.length);
      res.end(buffer.buffer);
      return;
    }

    const finalFile = file;

    fs.readFile(finalFile, (err, data) => {
      if (err) {
        return ctx.route.internalServerError(req, res, err);
      }
      res.setHeader('Content-Length', data.length);
      res.end(data);
      // only production caches resources
      if (this.isProduction === true) {
        this.cache.set(finalFile, data);
      }
    });
  }

  private supportsEncoding(req: http.IncomingMessage, encoding: 'gzip' | 'br'): boolean {
    return req.headers['accept-encoding'] !== undefined &&
           req.headers['accept-encoding'].includes(encoding);
  }
}
