import {expect} from 'chai';
import {isChunkLoadError, shouldReloadForChunkError} from '@/client/utils/chunkReload';

describe('chunkReload', () => {
  it('recognizes webpack chunk load errors', () => {
    expect(isChunkLoadError({name: 'ChunkLoadError', message: 'x'})).is.true;
    expect(isChunkLoadError(new Error('Loading chunk 96 failed.'))).is.true;
    expect(isChunkLoadError(new Error('Loading CSS chunk player-home failed'))).is.true;
    expect(isChunkLoadError(new Error('error loading dynamically imported module'))).is.true;
  });

  it('ignores unrelated errors and non-errors', () => {
    expect(isChunkLoadError(new Error('Not waiting for anything'))).is.false;
    expect(isChunkLoadError(undefined)).is.false;
    expect(isChunkLoadError(null)).is.false;
    expect(isChunkLoadError('a string')).is.false;
  });

  it('reloads for a chunk error when none was attempted recently', () => {
    const now = 100_000;
    expect(shouldReloadForChunkError(new Error('Loading chunk 5 failed'), now, 0)).is.true;
  });

  it('does not reload again within the cooldown', () => {
    const now = 100_000;
    expect(shouldReloadForChunkError(new Error('Loading chunk 5 failed'), now, now - 1_000)).is.false;
  });

  it('reloads again once the cooldown has passed', () => {
    const now = 100_000;
    expect(shouldReloadForChunkError(new Error('Loading chunk 5 failed'), now, now - 20_000)).is.true;
  });

  it('never reloads for an unrelated error', () => {
    expect(shouldReloadForChunkError(new Error('boom'), 100_000, 0)).is.false;
  });
});
