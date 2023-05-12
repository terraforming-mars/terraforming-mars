import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {SpaceStation} from '../../../src/server/cards/base/SpaceStation';
import {testGame} from '../../TestGame';

describe('SpaceStation', function() {
  it('Should play', function() {
    const card = new SpaceStation();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(card.getCardDiscount(player, card)).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
