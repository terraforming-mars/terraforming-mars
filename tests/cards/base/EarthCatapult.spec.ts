import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';

describe('EarthCatapult', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new EarthCatapult();
    const action = card.play(player);

    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(2);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

