import {expect} from 'chai';
import {PowerPlant} from '../../../src/cards/base/PowerPlant';
import {MagneticShield} from '../../../src/cards/promo/MagneticShield';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MagneticShield', function() {
  let card : MagneticShield; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MagneticShield();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play if not enough power tags available', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new PowerPlant());
    player.playedCards.push(new PowerPlant());
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getTerraformRating()).to.eq(24);
  });
});
