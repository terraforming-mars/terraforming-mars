import {expect} from 'chai';
import {SkyDocks} from '../../../src/server/cards/colonies/SkyDocks';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('SkyDocks', () => {
  it('Should play', () => {
    const card = new SkyDocks();
    const player = TestPlayer.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.colonies.getFleetSize()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
