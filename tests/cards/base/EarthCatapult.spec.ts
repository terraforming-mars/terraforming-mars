import {expect} from 'chai';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';

describe('EarthCatapult', function() {
  it('Should play', function() {
    const card = new EarthCatapult();

    const action = card.play();
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

