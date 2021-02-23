import * as http from 'http';

export class MockResponse {
  public headers: Map<string, string> = new Map();
  public content: string = '';

  public setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }
  public write(content: string) {
    this.content += content;
  }
  public end(content: string) {
    this.content += content;
  }

  public hide(): http.ServerResponse {
    return this as unknown as http.ServerResponse;
  }
}
