import {expect} from 'chai';
import {GalileanMining} from '../../../src/cards/prelude/GalileanMining';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GalileanMining', function() {
  let card : GalileanMining; let player : Player; let game : Game;

  beforeEach(function() {
    card = new GalileanMining();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;

    card.play(player);

    // SelectHowToPayDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
  });
});
