import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';

describe('EarthCatapult', function() {
  it('Should play', function() {
    const [, player] = testGame(1);
    const card = new EarthCatapult();
    const action = card.play(player);

    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(2);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

