import {expect} from 'chai';
import {Inventrix} from '../../../src/server/cards/corporation/Inventrix';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Inventrix', function() {
  let card: Inventrix;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Inventrix();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(card.getRequirementBonus()).to.eq(2);
  });

  it('Should take initial action', function() {
    player.runInitialAction(card);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
