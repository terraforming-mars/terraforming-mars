import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

import {IContext} from './IHandler';
import {BufferCache} from './BufferCache';
import {ContentType} from './ContentType';
import {Handler} from './Handler';

type Encoding = 'gzip' | 'br';

export class ServeAsset extends Handler {
  public static readonly INSTANCE: ServeAsset = new ServeAsset();
  private readonly cache = new BufferCache();

  // Public for tests
  public constructor(private cacheAgeSeconds: string | number = process.env.ASSET_CACHE_MAX_AGE || 0,
    // only production caches resources
    private cacheAssets: boolean = process.env.NODE_ENV === 'production') {
    super();
    // prime the cache with styles.css and a compressed copy of it styles.css
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

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (req.url === undefined) {
      ctx.route.internalServerError(req, res, new Error('no url on request'));
      return;
    }

    // Remove leading slash.
    const path = req.url.substring(1);

    const supportedEncodings = this.supportedEncodings(req);
    const toFile: {file?: string, encoding?: Encoding } = this.toFile(path, supportedEncodings);

    if (toFile.file === undefined) {
      return ctx.route.notFound(req, res);
    }

    const file = toFile.file;

    // asset caching
    const buffer = this.cache.get(file);
    if (buffer !== undefined) {
      if (req.headers['if-none-match'] === buffer.hash) {
        ctx.route.notModified(res);
        return;
      }
      res.setHeader('Cache-Control', 'must-revalidate');
      res.setHeader('ETag', buffer.hash);
    } else if (this.cacheAssets === false && req.url !== '/main.js' && req.url !== '/main.js.map') {
      res.setHeader('Cache-Control', 'max-age=' + this.cacheAgeSeconds);
    }

    const contentType = ContentType.getContentType(file);
    if (contentType !== undefined) {
      res.setHeader('Content-Type', contentType);
    }

    if (toFile.encoding !== undefined) {
      res.setHeader('Content-Encoding', toFile.encoding);
    }

    if (buffer !== undefined) {
      res.setHeader('Content-Length', buffer.buffer.length);
      res.end(buffer.buffer);
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        return ctx.route.internalServerError(req, res, err);
      }
      res.setHeader('Content-Length', data.length);
      res.end(data);
      if (this.cacheAssets === true) {
        this.cache.set(file, data);
      }
    });
  }

  private toFile(urlPath: string, encodings: Set<Encoding>): { file?: string, encoding?: Encoding } {
    switch (urlPath) {
    case 'assets/index.html':
    case 'assets/Prototype.ttf':
    case 'assets/futureforces.ttf':
      return {file: urlPath};

    case 'styles.css':
      const compressed = this.cache.get('styles.css.gz');
      if (compressed !== undefined && encodings.has('gzip')) {
        return {file: urlPath + '.gz', encoding: 'gzip'};
      }
      return {file: urlPath};

    case 'main.js':
    case 'main.js.map':
      let file = `build/${urlPath}`;
      let encoding: Encoding | undefined = undefined;
      if (encodings.has('br')) {
        encoding = 'br';
        file += '.br';
      } else if (encodings.has('gzip')) {
        encoding = 'gzip';
        file += '.gz';
      }
      return {file, encoding};

    case 'favicon.ico':
      return {file: 'assets/favicon.ico'};

    default:
      if (urlPath.endsWith('.png') || urlPath.endsWith('.jpg')) {
        const assetsRoot = path.resolve('./assets');
        const resolvedFile = path.resolve(path.normalize(urlPath));

        // Only allow assets inside of assets directory
        if (resolvedFile.startsWith(assetsRoot)) {
          return {file: resolvedFile};
        }
      }
    }

    return {};
  }

  private supportedEncodings(req: http.IncomingMessage): Set<Encoding> {
    const result = new Set<Encoding>();
    for (const header of String(req.headers['accept-encoding']).split(', ')) {
      if (header === 'br' || header === 'gzip') {
        result.add(header);
      }
    }
    return result;
  }
}
