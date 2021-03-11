import {expect} from 'chai';
import {CoronaExtractor} from '../../../src/cards/colonies/CoronaExtractor';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CoronaExtractor', function() {
  it('Should play', function() {
    const card = new CoronaExtractor();
    const player = TestPlayers.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(4);
  });
});
