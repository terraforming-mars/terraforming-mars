import {Game} from '../../../src/server/Game';
import {forceGenerationEnd, testGameOptions} from '../../TestingUtils';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {SyndicatePirateRaids} from '../../../src/server/cards/moon/SyndicatePirateRaids';

describe('SyndicatePirateRaids', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: Game;
  let card: SyndicatePirateRaids;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, otherPlayer], player, testGameOptions({coloniesExtension: true}));
    card = new SyndicatePirateRaids();
  });

  // This belongs in colonies tests.
  it('Everyone retrieves fleets', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.colonies.tradesThisGeneration).eq(1);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    forceGenerationEnd(game);

    expect(player.colonies.tradesThisGeneration).eq(0);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(0);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;
  });

  it('Pirate raider brings fleets home, but not other player', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.colonies.tradesThisGeneration).eq(1);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    card.play(player);

    forceGenerationEnd(game);

    expect(player.colonies.tradesThisGeneration).eq(0);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).eq(otherPlayer.id);
  });

  it('But next generation, fleets go home', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.colonies.tradesThisGeneration).eq(1);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    card.play(player);

    forceGenerationEnd(game);

    expect(player.colonies.tradesThisGeneration).eq(0);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    forceGenerationEnd(game);

    expect(player.colonies.tradesThisGeneration).eq(0);
    expect(otherPlayer.colonies.tradesThisGeneration).eq(0);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;
  });
});

