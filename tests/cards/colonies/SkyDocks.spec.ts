import {expect} from 'chai';
import {SkyDocks} from '../../../src/server/cards/colonies/SkyDocks';
import {TestPlayer} from '../../TestPlayer';

describe('SkyDocks', function() {
  it('Should play', function() {
    const card = new SkyDocks();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.simpleCanPlay(card)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.colonies.getFleetSize()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
