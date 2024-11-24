import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Thawer} from '../../../src/server/milestones/modular/Thawer';
import {TestPlayer} from '../../TestPlayer';
import {GlobalParameter} from '../../../src/common/GlobalParameter';

describe('Thawer', () => {
  let milestone: Thawer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Thawer();
    [/* game */, player] = testGame(2);
  });

  for (let idx = 0; idx <= 4; idx++) {
    it('Cannot claim ' + idx, () => {
      player.globalParameterSteps[GlobalParameter.TEMPERATURE] = idx;
      expect(milestone.getScore(player)).eq(idx);
      expect(milestone.canClaim(player)).is.false;
    });
  }

  it('Can claim', () => {
    player.globalParameterSteps[GlobalParameter.TEMPERATURE] = 5;
    expect(milestone.getScore(player)).eq(5);
    expect(milestone.canClaim(player)).is.true;
  });
});
