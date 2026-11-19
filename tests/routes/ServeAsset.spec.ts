import path from 'path';
import {expect} from 'chai';
import fs from 'fs';
import {FileAPI, ServeAsset} from '../../src/server/routes/ServeAsset';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';

class FileApiMock extends FileAPI {
  public constructor() {
    super();
  }
  public override readFile(path: string): Promise<Buffer> {
    return Promise.resolve(Buffer.from('data: ' + path));
  }
  public override existsSync(_path: string): boolean {
    return true;
  }
}

describe('ServeAsset', () => {
  let instance: ServeAsset;
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  let fileApi: FileApiMock;

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
    scaffolding.url = '/build/index.html';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content.startsWith('<!DOCTYPE html>'));
  });

  it('sw.js', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/sw.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: build/sw.js');
  });

  it('chunk js file', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/chunks/player-home.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: ' + path.resolve('build/chunks/player-home.js'));
  });

  it('chunk js.map file', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/chunks/player-home.js.map';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.content).eq('data: ' + path.resolve('build/chunks/player-home.js.map'));
  });

  it('rejects a folder next to assets whose name starts the same', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/assets-other/secret.json';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.statusCode).eq(statusCode.notFound);
  });

  it('rejects path traversal in chunks', async () => {
    instance = new ServeAsset(undefined, false, fileApi);
    scaffolding.url = '/chunks/../main.js';
    scaffolding.req.headers['accept-encoding'] = '';
    await scaffolding.get(instance, res);
    expect(res.statusCode).eq(statusCode.notFound);
  });

  it('serves all script sources referenced in index.html', async () => {
    const html = fs.readFileSync('build/index.html', 'utf8');
    const srcs = [...html.matchAll(/<script[^>]* src="([^"]+)"/g)].map((m) => m[1]);
    expect(srcs).to.not.be.empty;
    for (const src of srcs) {
      const perRes = new MockResponse();
      const perScaffolding = new RouteTestScaffolding();
      instance = new ServeAsset(undefined, false, fileApi);
      perScaffolding.url = src.startsWith('/') ? src : '/' + src;
      perScaffolding.req.headers['accept-encoding'] = '';
      await perScaffolding.get(instance, perRes);
      expect(perRes.statusCode, `${src} should return 200`).eq(statusCode.ok);
    }
  });
});
