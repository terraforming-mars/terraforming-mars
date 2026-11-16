import fs from 'fs';
import path from 'path';
import * as responses from '../server/responses';

import {Context} from './IHandler';
import {BufferCache} from './BufferCache';
import {ContentType} from './ContentType';
import {Handler} from './Handler';
import {isProduction} from '../utils/server';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

type Encoding = 'gzip' | 'br';

// Served as they are, under exactly this path
const FIXED_FILES: ReadonlyArray<string> = [
  'assets/index.html',
  'assets/Prototype.ttf',
  'assets/Prototype-ru.ttf',
  'assets/Prototype-pl.ttf',
  'assets/futureforces.ttf',
];

// Build files, served with their compressed variants
const MAIN_FILES: ReadonlyArray<string> = ['main.js', 'main.js.map'];

export class FileAPI {
  public static readonly INSTANCE: FileAPI = new FileAPI();

  protected constructor() {}

  public readFileSync(path: string): Buffer {
    return fs.readFileSync(path);
  }
  public readFile(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  public existsSync(path: string): boolean {
    return fs.existsSync(path);
  }
}
export class ServeAsset extends Handler {
  public static readonly INSTANCE: ServeAsset = new ServeAsset();
  private readonly cache = new BufferCache();
  private readonly existsCache = new Map<string, boolean>();
  private mainEntryFile: string | undefined;
  private mainCssFile: string | undefined;
  private mainEntryLoaded = false;

  // Public for tests
  public constructor(private cacheAgeSeconds: string | number = process.env.ASSET_CACHE_MAX_AGE || 0,
    // only production caches resources
    private cacheAssets: boolean = isProduction(),
    private fileApi: FileAPI = FileAPI.INSTANCE) {
    super();
    // Prime the cache. Compressed styles are optional: development compiles only the raw file.
    this.cache.set('build/styles.css', fileApi.readFileSync('build/styles.css'));
    for (const file of ['build/styles.css.gz', 'build/styles.css.br']) {
      try {
        this.cache.set(file, fileApi.readFileSync(file));
      } catch {
        // Not compressed yet.
      }
    }
    // client.css only exists after a Vite build (and not while Vite serves the app in development)
    for (const file of ['build/client.css', 'build/client.css.gz', 'build/client.css.br']) {
      if (fileApi.existsSync(file)) {
        this.cache.set(file, fileApi.readFileSync(file));
      }
    }
  }

  public override async get(req: Request, res: Response, _ctx: Context): Promise<void> {
    if (req.url === undefined) {
      throw RouteError.internalServerError('no url on request');
    }

    // Remove leading slash.
    const path = req.url.substring(1);

    const supportedEncodings = this.supportedEncodings(req);
    const toFile: {file?: string, encoding?: Encoding } = this.toFile(path, supportedEncodings);

    if (toFile.file === undefined) {
      throw RouteError.notFound();
    }

    const file = toFile.file;

    // asset caching
    const buffer = this.cacheAssets ? this.cache.get(file) : undefined;
    if (buffer !== undefined) {
      if (req.headers['if-none-match'] === buffer.hash) {
        responses.notModified(res);
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
      const data = this.withIdentity(file, buffer.buffer);
      res.setHeader('Content-Length', data.length);
      res.end(data);
      return;
    }

    try {
      const raw = await this.fileApi.readFile(file);
      if (this.cacheAssets === true) {
        this.cache.set(file, raw);
      }
      const data = this.withIdentity(file, raw);
      res.setHeader('Content-Length', data.length);
      res.end(data);
    } catch (err) {
      if ((err as {code?: string}).code === 'ENOENT') {
        throw RouteError.notFound();
      }
      console.log(err);
      throw RouteError.internalServerError('Cannot serve ' + path);
    }
  }

  // The Vite build emits a hashed entry file; assets/index.html keeps main.js as the development fallback.
  private mainEntry(): string | undefined {
    if (this.mainEntryLoaded === false) {
      this.mainEntryLoaded = true;
      try {
        if (this.fileApi.existsSync('build/main-manifest.json')) {
          const manifest = JSON.parse(this.fileApi.readFileSync('build/main-manifest.json').toString('utf8')) as
            Record<string, {isEntry?: boolean, file?: string}>;
          const entry = manifest['src/client/main.ts'] ?? Object.values(manifest).find((item) => item.isEntry === true);
          if (entry !== undefined && typeof entry.file === 'string') {
            this.mainEntryFile = entry.file;
          }
          const style = manifest['style.css'] ??
            Object.values(manifest).find((item) => item.file?.endsWith('.css') === true);
          if (style !== undefined && typeof style.file === 'string') {
            this.mainCssFile = style.file;
          }
        }
      } catch (err) {
        // No manifest (development) or unreadable manifest: keep main.js, which Vite serves in dev.
        console.log('Cannot read build/main-manifest.json', err);
      }
    }
    return this.mainEntryFile;
  }

  private withIdentity(file: string, raw: Buffer): Buffer {
    if (file !== 'assets/index.html') {
      return raw;
    }
    let html = raw.toString('utf8');
    const entry = this.mainEntry();
    if (entry !== undefined) {
      html = html.replace('src="main.js"', `src="${entry}"`);
    }
    if (this.mainCssFile !== undefined) {
      html = html.replace('href="client.css"', `href="${this.mainCssFile}"`);
    }
    return Buffer.from(html);
  }

  private exists(file: string): boolean {
    const cached = this.existsCache.get(file);
    if (cached !== undefined) {
      return cached;
    }
    const exists = this.fileApi.existsSync(file);
    this.existsCache.set(file, exists);
    return exists;
  }

  private toMainFile(file: string, encodings: Set<Encoding>): { file?: string, encoding?: Encoding } {
    // Only serve compressed versions in production. Development mode serves
    // uncompressed versions because they can be hot-swapped.
    if (isProduction()) {
      if (encodings.has('br') && this.exists(file + '.br')) {
        return {file: file + '.br', encoding: 'br'};
      } else if (encodings.has('gzip') && this.exists(file + '.gz')) {
        return {file: file + '.gz', encoding: 'gzip'};
      }
    }

    // Fallback on uncompressed file in development or when the compression
    // step skipped this file (source maps, for example).
    return {file, encoding: undefined};
  }

  private toFile(urlPath: string, encodings: Set<Encoding>): { file?: string, encoding?: Encoding } {
    const fixedFile = FIXED_FILES.find((file) => file === urlPath);
    if (fixedFile !== undefined) {
      return {file: fixedFile};
    }
    const mainFile = MAIN_FILES.find((file) => file === urlPath);
    if (mainFile !== undefined) {
      return this.toMainFile(`build/${mainFile}`, encodings);
    }
    switch (urlPath) {
    case 'styles.css':
      if (encodings.has('br') && this.cache.get('build/styles.css.br') !== undefined) {
        return {file: 'build/styles.css.br', encoding: 'br'};
      }
      if (encodings.has('gzip') && this.cache.get('build/styles.css.gz') !== undefined) {
        return {file: 'build/styles.css.gz', encoding: 'gzip'};
      }
      return {file: 'build/styles.css'};

    case 'client.css':
      if (encodings.has('br') && this.exists('build/client.css.br')) {
        return {file: 'build/client.css.br', encoding: 'br'};
      }
      if (encodings.has('gzip') && this.exists('build/client.css.gz')) {
        return {file: 'build/client.css.gz', encoding: 'gzip'};
      }
      return {file: 'build/client.css'};

    // sw.js is empty. Although not confirmed, it seems sw.js is necessary
    // for mobile notifications. If confirmed that it is not necessary, this
    // can be removed.
    case 'sw.js':
    case '/sw.js':
      return {file: 'build/sw.js'};

    case 'favicon.ico':
      return {file: 'assets/favicon.ico'};

    default:
      // The hashed entry file emitted by Vite (named in assets/index.html at serve time).
      if (/^main-[A-Za-z0-9_-]+\.js(\.map)?$/.test(urlPath)) {
        return this.toMainFile(`build/${urlPath}`, encodings);
      }
      if (/^client-[A-Za-z0-9_-]+\.css(\.map)?$/.test(urlPath)) {
        return this.toMainFile(`build/${urlPath}`, encodings);
      }
      // Serve JS chunks produced by the Vite build.
      if (urlPath.startsWith('chunks/')) {
        const chunksRoot = path.resolve('./build/chunks');
        const resolvedFile = path.resolve(path.normalize('build/' + urlPath));
        // With the separator: a sibling such as build/chunks-other is not inside
        if (resolvedFile.startsWith(chunksRoot + path.sep)) {
          if (urlPath.endsWith('.js') || urlPath.endsWith('.js.map')) {
            return this.toMainFile(resolvedFile, encodings);
          }
        }
      }

      if (urlPath.endsWith('.png') || urlPath.endsWith('.jpg') || urlPath.endsWith('.json') || urlPath.endsWith('.svg')) {
        // Images referenced from component CSS are emitted by Vite (hashed) into build/assets and
        // take precedence over the original file in the assets directory.
        if (urlPath.startsWith('assets/')) {
          const buildAssetsRoot = path.resolve('./build/assets');
          const buildFile = path.resolve(path.normalize('build/' + urlPath));
          if (buildFile.startsWith(buildAssetsRoot + path.sep) && this.exists(buildFile)) {
            return {file: buildFile};
          }
        }
        const assetsRoot = path.resolve('./assets');
        const resolvedFile = path.resolve(path.normalize(urlPath));

        // Only allow assets inside of assets directory
        if (resolvedFile.startsWith(assetsRoot + path.sep)) {
          return {file: resolvedFile};
        }
      }
    }

    return {};
  }

  private supportedEncodings(req: Request): Set<Encoding> {
    const result = new Set<Encoding>();
    for (const header of String(req.headers['accept-encoding']).split(', ')) {
      if (header === 'br' || header === 'gzip') {
        result.add(header);
      }
    }
    return result;
  }
}
