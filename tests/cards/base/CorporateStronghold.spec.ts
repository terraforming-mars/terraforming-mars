import {expect} from 'chai';
import {CorporateStronghold} from '../../../src/server/cards/base/CorporateStronghold';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('CorporateStronghold', function() {
  let card: CorporateStronghold;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CorporateStronghold();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);

    UnderworldTestHelper.assertPlaceCity(player, player.popWaitingFor());

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(-2);
  });
});
