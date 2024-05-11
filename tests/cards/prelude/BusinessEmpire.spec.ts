import {expect} from 'chai';
import {BusinessEmpire} from '../../../src/server/cards/prelude/BusinessEmpire';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('BusinessEmpire', function() {
  let card: BusinessEmpire;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new BusinessEmpire();
    [game, player] = testGame(1);
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
