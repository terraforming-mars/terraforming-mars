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
  }
  public constructor() {
    super();
  }
  public readFileSync(path: string): Buffer {
    this.counts.readFileSync++;
    return Buffer.from('data: ' + path);
  }
  public readFile(path: string, cb: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void {
    this.counts.readFile++;
    cb(null, Buffer.from('data: ' + path));
  }
  public existsSync(_path: string): boolean {
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

  // Strictly speaking |parameters| can also accept a fragment.
  const setRequest = function(parameters: string, headers: Array<Array<string>> = []) {
    req.url = parameters;
    ctx.url = new URL('http://boo.com' + parameters);
    headers.forEach((entry) => {
      req.headers[entry[0]] = entry[1];
    });
  };

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
    expect(fileApi.counts).deep.eq({readFile: 0, readFileSync: 3, existsSync: 0});

    setRequest('/styles.css', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);

    expect(res.content).eq('data: build/styles.css');
    expect(fileApi.counts).deep.eq({
      readFile: 1, // Still read.
      readFileSync: 3,
      existsSync: 0,
    });
  });

  it('styles.css.gz: cached', () => {
    instance = new ServeAsset(undefined, true, fileApi);
    // Primes the cache.
    expect(fileApi.counts).deep.eq({readFile: 0, readFileSync: 3, existsSync: 0});

    setRequest('/styles.css', [['accept-encoding', 'gzip']]);
    instance.get(req, res.hide(), ctx);

    expect(res.content).eq('data: build/styles.css.gz');
    expect(fileApi.counts).deep.eq({
      readFile: 0, // Does not change
      readFileSync: 3,
      existsSync: 0,
    });
  });


  // Cached CSS
  // Uncached CSS
});
