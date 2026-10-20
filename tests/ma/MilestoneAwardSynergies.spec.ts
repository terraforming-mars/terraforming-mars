import {expect} from 'chai';
import {awardNames} from '../../src/common/ma/AwardName';
import {milestoneNames} from '../../src/common/ma/MilestoneName';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {chooseMilestonesAndAwards} from '../../src/server/ma/MilestoneAwardSelector';
import {synergies} from '../../src/server/ma/MilestoneAwardSynergies';

describe('MilestoneAwardSynergies', () => {
  it('is symmetric', () => {
    const names = [...milestoneNames, ...awardNames];
    const asymmetric: Array<string> = [];
    for (const a of names) {
      for (const b of names) {
        if (synergies.get(a, b) !== synergies.get(b, a)) {
          asymmetric.push(`${a} | ${b}`);
        }
      }
    }
    expect(asymmetric.slice(0, 5)).deep.eq([]);
  });

  it('random selection does not fail the synergy rules', () => {
    const gameOptions = {...DEFAULT_GAME_OPTIONS, randomMA: RandomMAOptionType.LIMITED, includeFanMA: true};
    for (let i = 0; i < 300; i++) {
      try {
        chooseMilestonesAndAwards(gameOptions);
      } catch (e) {
        expect((e as Error).message).does.not.contain('does not satisfy the given synergy rules');
      }
    }
  });
});
