import zlib from 'zlib';

// Quality 6 measured as the sweet spot: near-best compression ratio at
// single-digit-to-tens-of-ms latency, even on the largest game snapshots.
const BROTLI_QUALITY = 6;

export function compressToBrotli(text: string): Buffer {
  return zlib.brotliCompressSync(Buffer.from(text, 'utf8'), {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY,
    },
  });
}

export function decompressFromBrotli(buf: Buffer): string {
  return zlib.brotliDecompressSync(buf).toString('utf8');
}
