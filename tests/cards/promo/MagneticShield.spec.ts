import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {MagneticShield} from '../../../src/server/cards/promo/MagneticShield';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticShield', function() {
  let card: MagneticShield;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MagneticShield();
    [/* game */, player] = testGame(2);
  });

  it('Can not play if not enough power tags available', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new PowerPlant());
    player.playedCards.push(new PowerPlant());
    player.playedCards.push(new PowerPlant());
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(24);
  });
});
