import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import {IContext} from './IHandler';
import {BufferCache} from './BufferCache';
import {ContentType} from './ContentType';
import {Handler} from './Handler';
import {isProduction} from '../utils/server';

type Encoding = 'gzip' | 'br';

export class FileAPI {
  public static readonly INSTANCE: FileAPI = new FileAPI();

  protected constructor() {}

  public readFileSync(path: string): Buffer {
    return fs.readFileSync(path);
  }
  public readFile(path: string, cb: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void {
    fs.readFile(path, cb);
  }
  public existsSync(path: string): boolean {
    return fs.existsSync(path);
  }
}
export class ServeAsset extends Handler {
  public static readonly INSTANCE: ServeAsset = new ServeAsset();
  private readonly cache = new BufferCache();

  // Public for tests
  public constructor(private cacheAgeSeconds: string | number = process.env.ASSET_CACHE_MAX_AGE || 0,
    // only production caches resources
    private cacheAssets: boolean = isProduction(),
    private fileApi: FileAPI = FileAPI.INSTANCE) {
    super();
    // prime the cache with styles.css and a compressed copy of it styles.css
    const styles = fileApi.readFileSync('build/styles.css');
    this.cache.set('build/styles.css', styles);
    const compressed = fileApi.readFileSync('build/styles.css.gz');
    this.cache.set('build/styles.css.gz', compressed);
    const brotli = fileApi.readFileSync('build/styles.css.br');
    this.cache.set('build/styles.css.br', brotli);
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
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
    const buffer = this.cacheAssets ? this.cache.get(file) : undefined;
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

    this.fileApi.readFile(file, (err, data) => {
      if (err) {
        console.log(err);
        return ctx.route.internalServerError(req, res, 'Cannot serve ' + path);
      }
      res.setHeader('Content-Length', data.length);
      res.end(data);
      if (this.cacheAssets === true) {
        this.cache.set(file, data);
      }
    });
  }

  private toMainFile(urlPath: string, encodings: Set<Encoding>): { file?: string, encoding?: Encoding } {
    let file = `build/${urlPath}`;
    let encoding: Encoding | undefined;
    if (encodings.has('br')) {
      encoding = 'br';
      file += '.br';
    } else if (encodings.has('gzip')) {
      encoding = 'gzip';
      file += '.gz';
    }

    // Return not-compressed .js files for development mode
    if (!isProduction() && !this.fileApi.existsSync(file)) {
      encoding = undefined;
      file = `build/${urlPath}`;
    }

    return {file, encoding};
  }

  private toServiceWorkerFile(urlPath: string): { file?: string, encoding?: Encoding } {
    const file = `build/src/client/${urlPath}`;

    return {file};
  }

  private toFile(urlPath: string, encodings: Set<Encoding>): { file?: string, encoding?: Encoding } {
    switch (urlPath) {
    case 'assets/index.html':
    case 'assets/Prototype.ttf':
    case 'assets/futureforces.ttf':
      return {file: urlPath};

    case 'styles.css':
      if (encodings.has('br')) {
        return {file: 'build/styles.css.br', encoding: 'br'};
      }
      if (encodings.has('gzip')) {
        return {file: 'build/styles.css.gz', encoding: 'gzip'};
      }
      return {file: 'build/styles.css'};

    case 'main.js':
    case 'main.js.map':
      return this.toMainFile(urlPath, encodings);

    case 'sw.js':
      return this.toServiceWorkerFile(urlPath);

    case 'favicon.ico':
      return {file: 'assets/favicon.ico'};

    default:
      if (urlPath.endsWith('.png') || urlPath.endsWith('.jpg') || urlPath.endsWith('.json')) {
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
