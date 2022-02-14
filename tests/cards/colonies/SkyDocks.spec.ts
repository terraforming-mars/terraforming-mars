import {expect} from 'chai';
import {SkyDocks} from '../../../src/cards/colonies/SkyDocks';
import {TestPlayers} from '../../TestPlayers';

describe('SkyDocks', function() {
  it('Should play', function() {
    const card = new SkyDocks();
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getFleetSize()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
