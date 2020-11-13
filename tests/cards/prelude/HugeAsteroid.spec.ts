import {expect} from 'chai';
import {HugeAsteroid} from '../../../src/cards/prelude/HugeAsteroid';
import {Color} from '../../../src/Color';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('HugeAsteroid', function() {
  let card : HugeAsteroid; let player : Player; let game : Game;

  beforeEach(function() {
    card = new HugeAsteroid();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player], player);
  });

  it('Can\'t play', function() {
    player.megaCredits = 4;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player, game)).is.true;
    const initialTR = player.getTerraformRating();

    card.play(player, game);

    // SelectHowToPayDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player.getTerraformRating()).to.eq(initialTR + 3);
  });
});
