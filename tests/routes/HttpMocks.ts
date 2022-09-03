import * as http from 'http';

export class MockResponse {
  public headers: Map<string, string> = new Map();
  public content = '';
  public statusCode = 200;

  public setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }
  public write(content: string) {
    this.content += content;
  }
  public end(content: string | undefined = undefined) {
    if (content) {
      this.content += content;
    }
  }
  public writeHead(statusCode: number): void {
    this.statusCode = statusCode;
  }

  // MockResponse isn't really of type ServerResponse,
  // and this makes it seem like it is so we can sneak
  // one of these past the compiler.
  public hide(): http.ServerResponse {
    return this as unknown as http.ServerResponse;
  }
}
