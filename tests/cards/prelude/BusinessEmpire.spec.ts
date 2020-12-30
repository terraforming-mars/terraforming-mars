import {expect} from 'chai';
import {BusinessEmpire} from '../../../src/cards/prelude/BusinessEmpire';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('BusinessEmpire', function() {
  let card : BusinessEmpire; let player : Player; let game : Game;

  beforeEach(function() {
    card = new BusinessEmpire();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 6;
    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);

    // SelectHowToPayDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(6);
  });
});
