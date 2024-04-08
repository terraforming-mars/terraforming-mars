import {expect} from 'chai';
import {FileAPI, ServeAsset} from '../../src/server/routes/ServeAsset';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';
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
  public override readFile(path: string): Promise<Buffer> {
    this.counts.readFile++;
    return Promise.resolve(Buffer.from('data: ' + path));
  }
  public override existsSync(_path: string): boolean {
    this.counts.existsSync++;
    return true;
  }
}

describe('ServeAsset', () => {
  let instance: ServeAsset;
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  let fileApi: FileApiMock;
  // The expected state of call counts in most simple cases in this test. This is a template
  // used and overridden below. That makes how individual condition changes these calls.
  const primedCache = {
    readFile: 0,
    readFileSync: 3,
    existsSync: 0,
  };

  const storedNodeEnv = process.env.NODE_ENV;
  beforeEach(() => {
    instance = new ServeAsset(undefined, false);
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
    fileApi = new FileApiMock();
  });
  afterEach(() => {
    process.env.NODE_ENV = storedNodeEnv;
  });
  it('bad filename', async () => {
    scaffolding.url = 'goo.goo.gaa.gaa';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('index.html', async () => {
    scaffolding.url = '/assets/index.html';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content.startsWith('<!DOCTYPE html>'));
  });

  it('styles.css', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/styles.css';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/styles.css');
  });

  it('styles.css.gz', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/styles.css';
    scaffolding.req.headers['accept-encoding'] = 'gzip';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/styles.css.gz');
  });

  it('styles.css: uncached', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    // Primes the cache.
    expect(fileApi.counts).deep.eq(primedCache);

    scaffolding.url = '/styles.css';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);

    expect(res.content).eq('data: build/styles.css');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1, // Still read.
    });
  });

  it('styles.css.gz: cached', async () => {
    instance = new ServeAsset(undefined, true, fileApi);
    // Primes the cache.
    expect(fileApi.counts).deep.eq(primedCache);

    scaffolding.url = '/styles.css';
    scaffolding.req.headers['accept-encoding'] = 'gzip';
    await scaffolding.get(instance, res);

    expect(res.content).eq('data: build/styles.css.gz');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 0, // Does not change
    });
  });

  it('development main.js', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/main.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/main.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 1,
    });
  });

  it('production main.js', async () => {
    process.env.NODE_ENV = 'production';
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/main.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/main.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 0,
    });
  });

  it('sw.js', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/sw.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/src/client/sw.js');
    expect(fileApi.counts).deep.eq({
      ...primedCache,
      readFile: 1,
      existsSync: 0,
    });
  });
});
