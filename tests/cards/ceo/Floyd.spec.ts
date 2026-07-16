import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {forceGenerationEnd, runAllActions, cast, churn} from '../../TestingUtils';
import {Floyd} from '../../../src/server/cards/ceos/Floyd';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {testGame} from '../../TestGame';

describe('Floyd', () => {
  let card: Floyd;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Floyd();
    [game, player] = testGame(2, {ceoExtension: true});
  });

  it('Cannot act without cards', () => {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', () => {
    player.playedCards.push(card);
    game.generation = 6;
    player.megaCredits = 6;

    const asteroidMining = new AsteroidMining();
    expect(card.canAct(player)).is.false;
    player.cardsInHand.push(asteroidMining);
    expect(card.canAct(player)).is.true;

    expect(player.getCardCost(asteroidMining)).eq(30);
    expect(player.canPlay(asteroidMining)).is.false;

    const selectProjectCardToPlay = cast(churn(card.action(player), player), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).deep.eq([asteroidMining]);

    expect(player.getCardCost(asteroidMining)).eq(5);
    expect(player.canPlay(asteroidMining)).is.true;
  });

  it('Can only act once per game', () => {
    card.action(player);
    runAllActions(game);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
