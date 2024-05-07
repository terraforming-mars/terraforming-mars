import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/server/cards/promo/FieldCappedCity';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('FieldCappedCity', function() {
  it('Should play', function() {
    const card = new FieldCappedCity();
    const [/* game */, player] = testGame(2);
    expect(card.play(player)).is.undefined;

    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());
    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});

