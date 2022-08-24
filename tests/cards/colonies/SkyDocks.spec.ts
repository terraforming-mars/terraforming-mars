import {expect} from 'chai';
import {SkyDocks} from '../../../src/server/cards/colonies/SkyDocks';
import {TestPlayer} from '../../TestPlayer';

describe('SkyDocks', function() {
  it('Should play', function() {
    const card = new SkyDocks();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.colonies.getFleetSize()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
