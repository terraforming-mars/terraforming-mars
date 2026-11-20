import {randomBytes} from 'crypto';
import {StrongRandom} from '../../common/utils/Random';

/**
 * A fresh {@link StrongRandom} seeded from the operating system's CSPRNG. Lives on the
 * server so Node's `crypto` never reaches the shared `common` module (and the client bundle).
 * Used for live games, whose shuffle a player must not be able to reconstruct.
 */
export function createStrongRandom(): StrongRandom {
  const bytes = randomBytes(16);
  const words = [
    bytes.readUInt32LE(0),
    bytes.readUInt32LE(4),
    bytes.readUInt32LE(8),
    bytes.readUInt32LE(12),
  ];
  return StrongRandom.fromEntropy(words);
}
