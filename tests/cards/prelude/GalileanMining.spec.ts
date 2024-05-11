import {expect} from 'chai';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('GalileanMining', function() {
  let card: GalileanMining;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new GalileanMining();
    [game, player] = testGame(1);
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
