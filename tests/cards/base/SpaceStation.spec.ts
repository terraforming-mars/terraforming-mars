import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {SpaceStation} from '../../../src/server/cards/base/SpaceStation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SpaceStation', function() {
  it('Should play', function() {
    const card = new SpaceStation();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(card.getCardDiscount(player, card)).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
