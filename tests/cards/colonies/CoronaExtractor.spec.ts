import {expect} from 'chai';
import {CoronaExtractor} from '../../../src/cards/colonies/CoronaExtractor';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(4);
  });
});
