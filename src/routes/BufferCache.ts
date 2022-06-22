
import * as crypto from 'crypto';

interface BufferHash {
  buffer: Buffer,
  hash: string
}

export class BufferCache {
  private storage = new Map<string, BufferHash>();
  public get(key: string): BufferHash | undefined {
    return this.storage.get(key);
  }
  public set(key: string, buffer: Buffer) {
    this.storage.set(key, {
      buffer,
      hash: this.hash(buffer),
    });
  }
  private hash(data: Buffer): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
