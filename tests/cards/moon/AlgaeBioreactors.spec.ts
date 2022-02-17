import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {AlgaeBioreactors} from '../../../src/cards/moon/AlgaeBioreactors';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Phase} from '../../../src/common/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../src/common/constants';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('AlgaeBioreactors', () => {
  let player: TestPlayer;
  let card: AlgaeBioreactors;
  let game: Game;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new AlgaeBioreactors();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.setProductionForTest({plants: 1});
    expect(player.getPlayableCards()).does.include(card);

    player.setProductionForTest({plants: 0});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({plants: 1});
    expect(player.getTerraformRating()).eq(14);
    expect(game.getOxygenLevel()).eq(0);
    moonData.colonyRate = 0;

    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).eq(0);
    expect(moonData.colonyRate).eq(1);
    expect(game.getOxygenLevel()).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });

  it('canPlay when Reds are in power', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, MOON_OPTIONS);
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.setProductionForTest({plants: 1});

    TestingUtils.testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
    moonData.colonyRate = 8;
    TestingUtils.testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
    (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;
    TestingUtils.testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  });
});

