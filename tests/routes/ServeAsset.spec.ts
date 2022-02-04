import * as http from 'http';
import {expect} from 'chai';
import {FileAPI, ServeAsset} from '../../src/routes/ServeAsset';
import {Route} from '../../src/routes/Route';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';

class FileApiMock extends FileAPI {
  public counts = {
    readFile: 0,
    readFileSync: 0,
    existsSync: 0,
  };
  public constructor() {
    super();
  }
  public override readFileSync(path: string): Buffer {
    this.counts.readFileSync++;
    return Buffer.from('data: ' + path);
  }
  public override readFile(path: string, cb: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void {
    this.counts.readFile++;
    cb(null, Buffer.from('data: ' + path));
  }
  public override existsSync(_path: string): boolean {
    this.counts.existsSync++;
    return true;
  }
}

describe('ServeAsset', () => {
  let instance: ServeAsset;
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;
  let fileApi: FileApiMock;
  // The expected state of call counts in most simple cases in this test. This is a template
  // used and overridden below. That makes how individual condition changes these calls.
  const primedCache = {
    readFile: 0,
    readFileSync: 3,
    existsSync: 0,
  };
  // Strictly speaking |parameters| can also accept a fragment.
  const setRequest = function(parameters: string, headers: Array<Array<string>> = []) {
    req.url = parameters;
    ctx.url = new URL('http://boo.com' + parameters);
    headers.forEach((entry) => {
      req.headers[entry[0]] = entry[1];
    });
  };
  const storedNodeEnv = process.env.NODE_ENV;
  beforeEach(() => {
    instance = new ServeAsset(undefined, false);
    req = {headers: {}} as http.IncomingMessage;
    res = new MockResponse();
    fileApi = new FileApiMock();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });
  afterEach(() => {
    process.env.NODE_ENV = storedNodeEnv;
  });
  it('bad filename', () => {
    setRequest('goo.goo.gaa.gaa', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('index.html', () => {
    setRequest('/assets/index.html', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content.startsWith('<!DOCTYPE html>'));
  });

  it('styles.css', () => {
    instance = new ServeAsset(undefined, false, fileApi);
    setRequest('/styles.css', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content).eq('data: build/styles.css');
  });

  it('styles.css.gz', () => {
    instance = new ServeAsset(undefined, false, fileApi);
    setRequest('/styles.css', [['accept-encoding', 'gzip']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content).eq('data: build/styles.css.gz');
  });

  it('styles.css: uncached', () => {
    instance = new ServeAsset(undefined, false, fileApi);
    // Primes the cache.
    expect(fileApi.counts).deep.eq(primedCache);

    setRequest('/styles.css', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);

    expect(res.content).eq('data: build/styles.css');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1, // Still read.
    });
  });

  it('styles.css.gz: cached', () => {
    instance = new ServeAsset(undefined, true, fileApi);
    // Primes the cache.
    expect(fileApi.counts).deep.eq(primedCache);

    setRequest('/styles.css', [['accept-encoding', 'gzip']]);
    instance.get(req, res.hide(), ctx);

    expect(res.content).eq('data: build/styles.css.gz');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 0, // Does not change
    });
  });

  it('development main.js', () => {
    instance = new ServeAsset(undefined, false, fileApi);
    setRequest('/main.js', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content).eq('data: build/main.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 1,
    });
  });

  it('production main.js', () => {
    process.env.NODE_ENV = 'production';
    instance = new ServeAsset(undefined, false, fileApi);
    setRequest('/main.js', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content).eq('data: build/main.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 0,
    });
  });

  it('sw.js', () => {
    instance = new ServeAsset(undefined, false, fileApi);
    setRequest('/sw.js', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content).eq('data: build/src/client/sw.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 0,
    });
  });
});
