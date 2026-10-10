import {MAX_VENUS_SCALE} from '../../common/constants';

/**
 * Above 30%, Venus's internal level still moves 2 per step (e.g. 30, 32, 34, 36 on Amazonis Planitia),
 * but players see each step as 1% (30, 31, 32, 33).
 */
export function venusScaleLevelForDisplay(level: number): number {
  if (level <= MAX_VENUS_SCALE) {
    return level;
  }
  return MAX_VENUS_SCALE + (level - MAX_VENUS_SCALE) / 2;
}
