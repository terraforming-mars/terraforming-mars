import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';

import {forceGenerationEnd, runAllActions, cast} from '../../TestingUtils';
import {Floyd} from '../../../src/server/cards/ceos/Floyd';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Floyd', function() {
  let card: Floyd;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Floyd();
    game = newTestGame(2, {ceoExtension: true});
    player = getTestPlayer(game, 0);
    player.popSelectInitialCards();
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.playedCards.push(card);
    game.generation = 6;
    player.megaCredits = 6;

    const asteroidMining = new AsteroidMining();
    expect(card.canAct(player)).is.false;
    player.cardsInHand.push(asteroidMining);
    expect(card.canAct(player)).is.true;

    expect(player.getCardCost(asteroidMining)).eq(30);
    expect(player.canPlay(asteroidMining)).is.false;

    card.action(player);
    runAllActions(game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).deep.eq([asteroidMining]);

    expect(player.getCardCost(asteroidMining)).eq(5);
    expect(player.canPlay(asteroidMining)).is.true;
  });

  it('Can only act once per game', function() {
    card.action(player);
    runAllActions(game);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
