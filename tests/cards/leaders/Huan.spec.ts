import {expect} from 'chai';
import {Huan} from '../../../src/server/cards/leaders/Huan';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Huan', function() {
  let card: Huan;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Huan();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player.playedCards.push(card);

    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
  });

  it('Takes action', function() {
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

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
