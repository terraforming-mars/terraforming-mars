import {expect} from 'chai';
import {AquiferTurbines} from '../../../src/server/cards/prelude/AquiferTurbines';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('AquiferTurbines', function() {
  let card: AquiferTurbines;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new AquiferTurbines();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Can play', function() {
    player.megaCredits = 3;
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', function() {
    player.megaCredits = 3;
    player.simplePlay(card);

    // PlaceOceanTile
    game.deferredActions.pop();

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});
