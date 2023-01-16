import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {Floyd} from '../../../src/server/cards/leaders/Floyd';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Floyd', function() {
  let card: Floyd;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Floyd();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new AsteroidMining());
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(game.deferredActions).has.length(2);
    player.getActionsThisGeneration().add(card.name);
    expect(card.getCardDiscount(player)).eq(15);

    runAllActions(game);
    expect(card.getCardDiscount(player)).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    runAllActions(game);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
