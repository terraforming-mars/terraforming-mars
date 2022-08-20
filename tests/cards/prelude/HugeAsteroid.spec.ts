import {expect} from 'chai';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('HugeAsteroid', function() {
  let card: HugeAsteroid;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new HugeAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Can not play', function() {
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;
    const initialTR = player.getTerraformRating();

    card.play(player);

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player.getTerraformRating()).to.eq(initialTR + 3);
  });
});
