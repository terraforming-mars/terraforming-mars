import {expect} from 'chai';
import {sanitizeEscapeVelocityOptions} from '../../../src/common/game/escapeVelocity';
import {
  DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS,
  DEFAULT_ESCAPE_VELOCITY_PENALTY,
  DEFAULT_ESCAPE_VELOCITY_PERIOD,
  DEFAULT_ESCAPE_VELOCITY_THRESHOLD,
} from '../../../src/common/constants';

describe('escapeVelocity', () => {
  it('keeps valid values', () => {
    expect(sanitizeEscapeVelocityOptions({
      thresholdMinutes: 35,
      bonusSectionsPerAction: 0,
      penaltyPeriodMinutes: 3,
      penaltyVPPerPeriod: 4,
    })).deep.eq({
      thresholdMinutes: 35,
      bonusSectionsPerAction: 0,
      penaltyPeriodMinutes: 3,
      penaltyVPPerPeriod: 4,
    });
  });

  it('parses numeric strings', () => {
    expect(sanitizeEscapeVelocityOptions({
      thresholdMinutes: '35',
      bonusSectionsPerAction: '2',
      penaltyPeriodMinutes: '3',
      penaltyVPPerPeriod: '4',
    })).deep.eq({
      thresholdMinutes: 35,
      bonusSectionsPerAction: 2,
      penaltyPeriodMinutes: 3,
      penaltyVPPerPeriod: 4,
    });
  });

  it('replaces empty and missing values with defaults', () => {
    expect(sanitizeEscapeVelocityOptions({
      thresholdMinutes: '',
      penaltyPeriodMinutes: '',
    })).deep.eq({
      thresholdMinutes: DEFAULT_ESCAPE_VELOCITY_THRESHOLD,
      bonusSectionsPerAction: DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS,
      penaltyPeriodMinutes: DEFAULT_ESCAPE_VELOCITY_PERIOD,
      penaltyVPPerPeriod: DEFAULT_ESCAPE_VELOCITY_PENALTY,
    });
  });

  it('replaces negative and non-finite values with defaults', () => {
    expect(sanitizeEscapeVelocityOptions({
      thresholdMinutes: -1,
      bonusSectionsPerAction: NaN,
      penaltyPeriodMinutes: Infinity,
      penaltyVPPerPeriod: 'x',
    })).deep.eq({
      thresholdMinutes: DEFAULT_ESCAPE_VELOCITY_THRESHOLD,
      bonusSectionsPerAction: DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS,
      penaltyPeriodMinutes: DEFAULT_ESCAPE_VELOCITY_PERIOD,
      penaltyVPPerPeriod: DEFAULT_ESCAPE_VELOCITY_PENALTY,
    });
  });

  it('replaces a penalty period of 0 with the default', () => {
    expect(sanitizeEscapeVelocityOptions({
      thresholdMinutes: 35,
      bonusSectionsPerAction: 2,
      penaltyPeriodMinutes: 0,
      penaltyVPPerPeriod: 1,
    }).penaltyPeriodMinutes).eq(DEFAULT_ESCAPE_VELOCITY_PERIOD);
  });
});
