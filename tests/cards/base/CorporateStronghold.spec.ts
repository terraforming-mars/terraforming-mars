import {expect} from 'chai';
import {CorporateStronghold} from '../../../src/server/cards/base/CorporateStronghold';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('CorporateStronghold', () => {
  let card: CorporateStronghold;
  let player: TestPlayer;

  beforeEach(() => {
    card = new CorporateStronghold();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(-2);
  });
});
