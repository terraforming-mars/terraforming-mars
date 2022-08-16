import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {MagneticShield} from '../../../src/server/cards/promo/MagneticShield';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticShield', function() {
  let card: MagneticShield;
  let player: Player;

  beforeEach(function() {
    card = new MagneticShield();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play if not enough power tags available', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new PowerPlant());
    player.playedCards.push(new PowerPlant());
    player.playedCards.push(new PowerPlant());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(24);
  });
});
