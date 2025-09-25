import {expect} from 'chai';
import {Huan} from '../../../src/server/cards/ceos/Huan';
import {IGame} from '../../../src/server/IGame';
import {Player} from '../../../src/server/Player';
import {testGame} from '../../TestGame';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';

describe('Huan', () => {
  let card: Huan;
  let game: IGame;
  let player: Player;
  let player2: Player;

  beforeEach(() => {
    card = new Huan();

    [game, player, player2] = testGame(2, {coloniesExtension: true});
    player.playedCards.push(card);
  });

  it('Takes action', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(player2);

    expect(player.colonies.tradesThisGeneration).eq(1);
    expect(player2.colonies.tradesThisGeneration).eq(1);
    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(player2.id);

    // Blocks opponents from trading, but clears all colony visitors
    const initialFleetSize = player.colonies.getFleetSize();
    card.action(player);
    forceGenerationEnd(game);

    expect(player.colonies.tradesThisGeneration).eq(0);
    expect(player2.colonies.tradesThisGeneration).eq(50);
    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;

    // Player gains an extra trade fleet
    expect(player.colonies.getFleetSize()).to.eq(initialFleetSize + 1);
  });

  it('Can only act once per game', () => {
    card.action(player);
    runAllActions(game);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
