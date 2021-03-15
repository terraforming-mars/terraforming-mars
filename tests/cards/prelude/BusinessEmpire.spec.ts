import {expect} from 'chai';
import {BusinessEmpire} from '../../../src/cards/prelude/BusinessEmpire';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('BusinessEmpire', function() {
  let card : BusinessEmpire; let player : Player; let game : Game;

  beforeEach(function() {
    card = new BusinessEmpire();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 6;
    expect(card.canPlay(player)).is.true;
    card.play(player);

    // SelectHowToPayDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(6);
  });
});
