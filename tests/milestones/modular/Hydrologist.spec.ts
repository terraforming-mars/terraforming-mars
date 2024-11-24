import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Hydrologist} from '../../../src/server/milestones/modular/Hydrologist';
import {TestPlayer} from '../../TestPlayer';
import {GlobalParameter} from '../../../src/common/GlobalParameter';

describe('Hydrologist', () => {
  let milestone: Hydrologist;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Hydrologist();
    [/* game */, player] = testGame(2);
  });

  for (let idx = 0; idx <= 3; idx++) {
    it('Cannot claim ' + idx, () => {
      player.globalParameterSteps[GlobalParameter.OCEANS] = idx;
      expect(milestone.getScore(player)).eq(idx);
      expect(milestone.canClaim(player)).is.false;
    });
  }

  it('Can claim', () => {
    player.globalParameterSteps[GlobalParameter.OCEANS] = 4;
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.true;
  });
});
