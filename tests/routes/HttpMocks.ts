import {Response} from '../../src/server/Response';

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
