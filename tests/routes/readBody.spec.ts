import {expect} from 'chai';
import {DEFAULT_MAX_BODY_BYTES, readBody} from '../../src/server/routes/readBody';
import {cast} from '../../src/common/utils/utils';
import {RouteError} from '../../src/server/routes/RouteError';
import {MockRequest} from './HttpMocks';
import {fail} from 'assert';

describe('readBody', () => {
  let req: MockRequest;

  beforeEach(() => {
    req = new MockRequest();
  });

  async function emit(...chunks: Array<string | Buffer>) {
    // This await defers every emit below by a microtask, simulating
    // reality and not depending on implementation details.
    await Promise.resolve();
    for (const chunk of chunks) {
      if (typeof chunk === 'string') {
        req.emitString(chunk);
      } else {
        req.emitter.emit('data', chunk);
      }
    }
    req.emitter.emit('end');
  }

  // Expect readBody to throw an error. Catch it here and
  // return it to the caller. Otherwise the test fails.
  async function rejection(promise: Promise<unknown>): Promise<unknown> {
    try {
      await promise;
    } catch (e) {
      return e;
    }
    fail('expected a rejection');
  }

  it('reads a body', async () => {
    const read = readBody(req);
    await emit('{"a": 1}');
    expect(await read).eq('{"a": 1}');
  });

  it('joins chunks', async () => {
    const read = readBody(req);
    await emit(
      '{"a"',
      ': 1', '}',
    );
    expect(await read).eq('{"a": 1}');
  });

  it('reads an empty body', async () => {
    const read = readBody(req);
    await emit();
    expect(await read).eq('');
  });

  it('decodes a character split across chunks', async () => {
    const snowman = Buffer.from('☃', 'utf8');
    expect(snowman.length).eq(3);
    const read = readBody(req);
    await emit(snowman.subarray(0, 1), snowman.subarray(1));
    expect(await read).eq('☃');
  });

  it('rejects when content-length declares too large', async () => {
    req.headers['content-length'] = String(DEFAULT_MAX_BODY_BYTES + 1);
    const error = await rejection(readBody(req));
    expect(cast(error, RouteError).kind).eq('contentTooLarge');
  });

  it('accepts a body at the limit', async () => {
    const read = readBody(req, 8);
    await emit('12345678');
    expect(await read).eq('12345678');
  });

  it('rejects a body over the limit', async () => {
    const read = readBody(req, 8);
    const emitted = emit('123456789');
    const error = await rejection(read);
    await emitted;
    expect(cast(error, RouteError).kind).eq('contentTooLarge');
  });

  it('rejects a body that grows over the limit across chunks', async () => {
    const read = readBody(req, 8);
    const emitted = emit('12345', '6789');
    const error = await rejection(read);
    await emitted;
    expect(cast(error, RouteError).kind).eq('contentTooLarge');
  });

  it('counts bytes, not characters', async () => {
    const read = readBody(req, 4);
    const emitted = emit('ééé');
    const error = await rejection(read);
    await emitted;
    expect(cast(error, RouteError).kind).eq('contentTooLarge');
  });

  it('stops reading a body that goes over the limit', async () => {
    const read = readBody(req, 8);
    const emitted = emit('123456789');
    await rejection(read);
    await emitted;
    expect(req.paused).is.true;
  });

  it('keeps reading a body within the limit', async () => {
    const read = readBody(req, 8);
    const emitted = emit('12345');
    expect(await read).eq('12345');
    await emitted;
    expect(req.paused).is.false;
  });

  it('rejects when the request stream errors', async () => {
    const read = readBody(req);
    const boom = new Error('socket blew up');
    const emitted = Promise.resolve().then(() => {
      req.emitString('partial');
      req.emitError(boom);
    });
    const error = await rejection(read);
    await emitted;
    expect(error).eq(boom);
  });

  it('rejects when the client disconnects before the body arrives', async () => {
    const read = readBody(req);
    const emitted = Promise.resolve().then(() => {
      req.emitString('partial');
      req.emitClose();
    });
    const error = await rejection(read);
    await emitted;
    expect(cast(error, RouteError).kind).eq('badRequest');
  });

  it('ignores the close that follows a completed body', async () => {
    const read = readBody(req);
    const emitted = Promise.resolve().then(() => {
      req.emitString('done');
      req.emitter.emit('end');
      // A healthy request emits 'close' after 'end'; it must not turn a success into a failure.
      req.emitClose();
    });
    expect(await read).eq('done');
    await emitted;
  });
});
