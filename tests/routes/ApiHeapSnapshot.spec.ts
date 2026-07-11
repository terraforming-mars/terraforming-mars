import {expect} from 'chai';
import {Readable, Writable} from 'node:stream';
import {ApiHeapSnapshot} from '../../src/server/routes/ApiHeapSnapshot';
import {Response} from '../../src/server/Response';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';

// A Response that is also a real Writable stream, so the handler's
// stream.pipeline(snapshot, res) has something to pipe into. MockResponse
// isn't a stream, so it can't be used for the streaming (happy) path.
class StreamingResponse extends Writable {
  public headers = new Map<string, string>();
  public statusCode = 200;
  private chunks: Array<Buffer> = [];

  public setHeader(key: string, value: string) {
    this.headers.set(key, value);
    return this as unknown as ReturnType<Response['setHeader']>;
  }
  public writeHead(statusCode: number) {
    this.statusCode = statusCode;
    return this as unknown as ReturnType<Response['setHeader']>;
  }
  public override _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void) {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }
  public get content(): string {
    return Buffer.concat(this.chunks).toString('utf8');
  }
}

describe('ApiHeapSnapshot', () => {
  let scaffolding: RouteTestScaffolding;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
  });

  it('validates server id', () => {
    const res = new MockResponse();
    scaffolding.url = '/api/heapsnapshot';
    ApiHeapSnapshot.INSTANCE.processRequest(scaffolding.req, res, scaffolding.ctx);
    expect(res.content).eq('Not authorized');
  });

  it('streams the heap snapshot to the response', async () => {
    // Snapshotting the real (large) test heap is slow and heavy, and we only
    // want to verify the handler wires the stream and headers up correctly.
    // Inject a tiny stand-in stream shaped like a snapshot.
    const fakeSnapshot = '{"snapshot":{"meta":{}},"nodes":[],"edges":[]}';
    const handler = ApiHeapSnapshot.forTesting(
      () => Readable.from([fakeSnapshot.slice(0, 10), fakeSnapshot.slice(10)]));

    const res = new StreamingResponse();
    scaffolding.url = '/api/heapsnapshot?serverId=1';
    await handler.get(scaffolding.req, res as unknown as Response, scaffolding.ctx);

    expect(res.headers.get('Content-Type')).eq('application/octet-stream');
    expect(res.headers.get('Content-Disposition')).contains('server.heapsnapshot');
    // The full snapshot stream was piped through verbatim.
    expect(res.content).eq(fakeSnapshot);
    const parsed = JSON.parse(res.content);
    expect(parsed).to.include.keys(['snapshot', 'nodes', 'edges']);
  });
});
