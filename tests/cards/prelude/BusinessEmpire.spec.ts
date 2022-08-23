import {expect} from 'chai';
import {BusinessEmpire} from '../../../src/server/cards/prelude/BusinessEmpire';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('BusinessEmpire', function() {
  let card: BusinessEmpire;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new BusinessEmpire();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Can not play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 6;
    expect(card.canPlay(player)).is.true;
    card.play(player);

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.production.megacredits).to.eq(6);
  });
});
