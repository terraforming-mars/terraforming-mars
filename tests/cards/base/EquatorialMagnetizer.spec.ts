import {expect} from 'chai';
import {EquatorialMagnetizer} from '../../../src/server/cards/base/EquatorialMagnetizer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('EquatorialMagnetizer', function() {
  let card: EquatorialMagnetizer;
  let player: TestPlayer;

  beforeEach(function() {
    card = new EquatorialMagnetizer();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not act', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.production.energy).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
