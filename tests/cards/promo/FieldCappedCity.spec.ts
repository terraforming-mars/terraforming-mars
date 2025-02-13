import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/server/cards/promo/FieldCappedCity';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('FieldCappedCity', () => {
  it('Should play', () => {
    const card = new FieldCappedCity();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);

    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());
    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});

