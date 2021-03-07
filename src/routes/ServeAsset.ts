import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

import {IContext} from './IHandler';
import {Route} from './Route';
import {BufferCache} from '../server/BufferCache';
import {ContentType} from './ContentType';
import {Handler} from './Handler';

const fileCache = new BufferCache();

export class ServeAsset extends Handler {
  public static readonly INSTANCE: ServeAsset = new ServeAsset();

  constructor(private assetCacheMaxAge: string | number = process.env.ASSET_CACHE_MAX_AGE || 0,
    private isProduction: boolean = process.env.NODE_ENV === 'production') {
    super();
    // prime the cache and compress styles.css
    const styles = fs.readFileSync('build/styles.css');
    fileCache.set('styles.css', styles);
    zlib.gzip(styles, function(err, compressed) {
      if (err !== null) {
        console.warn('error compressing styles', err);
        return;
      }
      fileCache.set('styles.css.gz', compressed);
    });
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (req.url === undefined) {
      ctx.route.internalServerError(req, res, new Error('no url on request'));
      return;
    }

    let contentEncoding: string | undefined;
    let file: string | undefined;

    if (req.url === '/styles.css') {
      const compressed = fileCache.get('styles.css.gz');
      file = 'styles.css';
      if (compressed !== undefined && Route.supportsEncoding(req, 'gzip')) {
        contentEncoding = 'gzip';
        file += '.gz';
      }
    } else if (req.url === '/assets/index.html') {
      file = req.url.substring(1);
    } else if (req.url === '/favicon.ico') {
      file = 'assets/favicon.ico';
    } else if (req.url === '/main.js' || req.url === '/main.js.map') {
      file = `build${req.url}`;
      if (Route.supportsEncoding(req, 'br')) {
        contentEncoding = 'br';
        file += '.br';
      } else if (Route.supportsEncoding(req, 'gzip')) {
        contentEncoding = 'gzip';
        file += '.gz';
      }
    } else if (req.url === '/assets/Prototype.ttf' || req.url === '/assets/futureforces.ttf') {
      file = req.url.substring(1);
    } else if (req.url.endsWith('.png') || req.url.endsWith('.jpg')) {
      const assetsRoot = path.resolve('./assets');
      const reqFile = path.resolve(path.normalize(req.url).slice(1));

      // Disallow to go outside of assets directory
      if (reqFile.startsWith(assetsRoot) === false) {
        return ctx.route.notFound(req, res);
      }
      file = reqFile;
    } else {
      return ctx.route.notFound(req, res);
    }
    // asset caching
    const buffer = fileCache.get(file);
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

    const contentType = ContentType.getContentType(file);
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
        fileCache.set(finalFile, data);
      }
    });
  }
}
