import {MAX_VENUS_SCALE} from '../../common/constants';

const STEPS_TO_MAX_VENUS_SCALE = MAX_VENUS_SCALE / 2;

/**
 * Converts a Venus scale level to the number of steps from 0.
 *
 * Steps are 2% each up to 30%, then 1% each (Amazonis Planitia goes to 33%).
 */
export function venusLevelToSteps(level: number): number {
  if (level <= MAX_VENUS_SCALE) {
    return level / 2;
  }
  return STEPS_TO_MAX_VENUS_SCALE + (level - MAX_VENUS_SCALE);
}

/** Converts the number of Venus steps from 0 to a Venus scale level. */
export function venusStepsToLevel(steps: number): number {
  if (steps <= STEPS_TO_MAX_VENUS_SCALE) {
    return steps * 2;
  }
  return MAX_VENUS_SCALE + (steps - STEPS_TO_MAX_VENUS_SCALE);
}

/**
 * Returns the Venus level after moving `steps` steps from `level`.
 *
 * `steps` can be negative.
 */
export function venusLevelAfterSteps(level: number, steps: number): number {
  return venusStepsToLevel(Math.max(0, venusLevelToSteps(level) + steps));
}

/** Returns the number of steps between `from` and `to`. */
export function venusStepsBetween(from: number, to: number): number {
  return venusLevelToSteps(to) - venusLevelToSteps(from);
}
