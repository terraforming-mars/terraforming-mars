import {Game} from '../../../src/server/Game';
import {testGameOptions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AlgaeBioreactors} from '../../../src/server/cards/moon/AlgaeBioreactors';
import {expect} from 'chai';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Phase} from '../../../src/common/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../src/common/constants';

describe('AlgaeBioreactors', () => {
  let player: TestPlayer;
  let card: AlgaeBioreactors;
  let game: Game;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new AlgaeBioreactors();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({plants: 1});
    expect(player.getPlayableCards()).does.include(card);

    player.production.override({plants: 0});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({plants: 1});
    expect(player.getTerraformRating()).eq(14);
    expect(game.getOxygenLevel()).eq(0);
    moonData.colonyRate = 0;

    card.play(player);

    expect(player.production.plants).eq(0);
    expect(moonData.colonyRate).eq(1);
    expect(game.getOxygenLevel()).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });

  it('canPlay when Reds are in power', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.production.override({plants: 1});

    testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
    moonData.colonyRate = 8;
    testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
    (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;
    testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  });
});

