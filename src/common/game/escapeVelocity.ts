import {EscapeVelocityOptions} from './NewGameConfig';
import {
  DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS,
  DEFAULT_ESCAPE_VELOCITY_PENALTY,
  DEFAULT_ESCAPE_VELOCITY_PERIOD,
  DEFAULT_ESCAPE_VELOCITY_THRESHOLD,
} from '../constants';

function nonNegativeOrDefault(value: unknown, defaultValue: number): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : defaultValue;
}

/**
 * Returns `options` with every invalid value replaced by its default.
 *
 * A valid value is a finite, non-negative number, or a string that parses to one. The penalty period must
 * also be greater than 0.
 *
 * Games created before the server validated these options may hold invalid values, such as "" from a
 * cleared form field.
 */
export function sanitizeEscapeVelocityOptions(options: {[K in keyof EscapeVelocityOptions]?: unknown}): EscapeVelocityOptions {
  const penaltyPeriodMinutes = nonNegativeOrDefault(options.penaltyPeriodMinutes, DEFAULT_ESCAPE_VELOCITY_PERIOD);
  return {
    thresholdMinutes: nonNegativeOrDefault(options.thresholdMinutes, DEFAULT_ESCAPE_VELOCITY_THRESHOLD),
    bonusSectionsPerAction: nonNegativeOrDefault(options.bonusSectionsPerAction, DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS),
    penaltyPeriodMinutes: penaltyPeriodMinutes > 0 ? penaltyPeriodMinutes : DEFAULT_ESCAPE_VELOCITY_PERIOD,
    penaltyVPPerPeriod: nonNegativeOrDefault(options.penaltyVPPerPeriod, DEFAULT_ESCAPE_VELOCITY_PENALTY),
  };
}
