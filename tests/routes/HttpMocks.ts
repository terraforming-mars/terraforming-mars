import {EventEmitter} from 'events';
import http from 'http';
import {Request} from '../../src/server/Request';
import {Response} from '../../src/server/Response';

export class MockRequest implements Request {
  public headers: {[x: string]: string} = {};
  public method: string = 'GET';
  public url: string = 'http://website.com';
  public emitter = new EventEmitter();
  public socket = {
    address: () => '127.0.0.1',
  };
  public once(type: 'end' | 'error' | 'close', cb: (err?: Error) => void): void {
    this.emitter.once(type, cb);
  }
  public on(type: 'data', cb: (dat: Buffer) => void): void {
    this.emitter.on(type, cb);
  }
  /* True once `pause` has been called. */
  public paused = false;
  public pause(): void {
    this.paused = true;
  }
  // Delivers `chunk` as the buffer a real request would carry.
  public emitString(chunk: string): void {
    this.emitter.emit('data', Buffer.from(chunk));
  }
  public emitError(err: Error): void {
    this.emitter.emit('error', err);
  }
  public emitClose(): void {
    this.emitter.emit('close');
  }
}

export class MockResponse implements Response {
  public headers: Map<string, string> = new Map();
  public content = '';
  public statusCode = 200;
  // A real ServerResponse rejects a second set of headers and anything written after
  // end. Without that, a route that responds twice silently overwrites its own reply
  // here and only fails in production.
  public headersSent = false;
  private ended = false;

  public setHeader(key: string, value: string): http.ServerResponse {
    this.assertOpen('set a header');
    this.headers.set(key, value);
    return this as unknown as http.ServerResponse;
  }
  public write(content: string): boolean {
    this.assertOpen('write');
    this.headersSent = true;
    this.content += content;
    return true;
  }
  public end(content?: string | Buffer) {
    this.assertOpen('end');
    if (content) {
      this.content += content;
    }
    this.headersSent = true;
    this.ended = true;
  }
  public writeHead(statusCode: number): http.ServerResponse {
    this.assertOpen('write headers');
    if (this.headersSent) {
      throw new Error('Cannot write headers after they are sent to the client');
    }
    this.headersSent = true;
    this.statusCode = statusCode;
    return this as unknown as http.ServerResponse;
  }
  public getHeader(name: string): number | string | string[] | undefined {
    return this.headers.get(name);
  }

  private assertOpen(action: string): void {
    if (this.ended) {
      throw new Error(`Cannot ${action} after the response has ended`);
    }
  }
}
