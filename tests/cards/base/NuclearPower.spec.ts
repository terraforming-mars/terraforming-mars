import {expect} from 'chai';
import {NuclearPower} from '../../../src/server/cards/base/NuclearPower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NuclearPower', function() {
  let card: NuclearPower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new NuclearPower();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    player.production.add(Resources.MEGACREDITS, -4);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
    expect(player.production.energy).to.eq(3);
  });
});
