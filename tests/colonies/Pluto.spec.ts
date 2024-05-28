import {expect} from 'chai';
import {cast} from '../TestingUtils';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {Pluto} from '../../src/server/colonies/Pluto';
import {IGame} from '../../src/server/IGame';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Pluto', function() {
  let pluto: Pluto;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    pluto = new Pluto();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(pluto);
  });

  it('Should build', function() {
    pluto.addColony(player);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('Should trade', function() {
    pluto.trade(player);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should give trade bonus', function() {
    pluto.addColony(player);
    runAllActions(game); // Draw a card
    expect(player.cardsInHand).has.lengthOf(2);

    pluto.trade(player2);
    runAllActions(game); // Draw a card
    expect(player.cardsInHand).has.lengthOf(3);

    const input = cast(player.getWaitingFor(), SelectCard<IProjectCard>);
    input.cb([input.cards[0]]); // Discard a card

    runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(2);
    expect(player2.cardsInHand).has.lengthOf(1);
  });

  it('Reward in order #4536', () => {
    pluto.addColony(player);
    pluto.addColony(player);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(4);

    pluto.trade(player2);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard<IProjectCard>);
    expect(player.cardsInHand).has.lengthOf(5);
    selectCard.cb([selectCard.cards[0]]); // Discard a card
    expect(player.cardsInHand).has.lengthOf(4);

    runAllActions(game);

    const selectCard2 = cast(player.popWaitingFor(), SelectCard<IProjectCard>);
    expect(player.cardsInHand).has.lengthOf(5);
    selectCard2.cb([selectCard2.cards[0]]); // Discard a card
    expect(player.cardsInHand).has.lengthOf(4);
  });
});
