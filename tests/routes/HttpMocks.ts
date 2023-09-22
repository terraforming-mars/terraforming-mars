import * as EventEmitter from 'events';
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
  public once(type: 'end', cb: () => void): void {
    this.emitter.once(type, cb);
  }
  public on(type: 'data', cb: (dat: Buffer) => void): void {
    this.emitter.on(type, cb);
  }
}

export class MockResponse implements Response {
  public headers: Map<string, string> = new Map();
  public content = '';
  public statusCode = 200;

  public setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }
  public write(content: string): boolean {
    this.content += content;
    return true;
  }
  public end(content?: string | Buffer) {
    if (content) {
      this.content += content;
    }
  }
  public writeHead(statusCode: number): void {
    this.statusCode = statusCode;
  }
}
