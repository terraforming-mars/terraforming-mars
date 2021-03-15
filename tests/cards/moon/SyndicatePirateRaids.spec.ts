import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {SyndicatePirateRaids} from '../../../src/cards/moon/SyndicatePirateRaids';

describe('SyndicatePirateRaids', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: Game;
  let card: SyndicatePirateRaids;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [player, otherPlayer], player, TestingUtils.setCustomGameOptions({coloniesExtension: true}));
    card = new SyndicatePirateRaids();
  });

  // This belongs in colonies tests.
  it('Everyone retrieves fleets', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.tradesThisGeneration).eq(1);
    expect(otherPlayer.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    TestingUtils.forceGenerationEnd(game);

    expect(player.tradesThisGeneration).eq(0);
    expect(otherPlayer.tradesThisGeneration).eq(0);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;
  });

  it('Pirate raider brings fleets home, but not other player', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.tradesThisGeneration).eq(1);
    expect(otherPlayer.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    card.play(player);

    TestingUtils.forceGenerationEnd(game);

    expect(player.tradesThisGeneration).eq(0);
    expect(otherPlayer.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).eq(otherPlayer.id);
  });

  it('But next generation, fleets go home', () => {
    game.colonies[0].trade(player);
    game.colonies[1].trade(otherPlayer);

    expect(player.tradesThisGeneration).eq(1);
    expect(otherPlayer.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    card.play(player);

    TestingUtils.forceGenerationEnd(game);

    expect(player.tradesThisGeneration).eq(0);
    expect(otherPlayer.tradesThisGeneration).eq(1);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).eq(otherPlayer.id);

    TestingUtils.forceGenerationEnd(game);

    expect(player.tradesThisGeneration).eq(0);
    expect(otherPlayer.tradesThisGeneration).eq(0);

    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;
  });
});

