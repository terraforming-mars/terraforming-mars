import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {cast} from '../../TestingUtils';

describe('EarthCatapult', () => {
  it('Should play', () => {
    const [/* game */, player] = testGame(1);
    const card = new EarthCatapult();
    const action = card.play(player);

    cast(action, undefined);
    expect(card.getVictoryPoints(player)).to.eq(2);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

