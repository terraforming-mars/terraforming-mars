import {expect} from 'chai';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('GalileanMining', function() {
  let card: GalileanMining;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new GalileanMining();
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

    card.play(player);

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.production.titanium).to.eq(2);
  });
});
