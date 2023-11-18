import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {setOxygenLevel, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AlgaeBioreactors} from '../../../src/server/cards/moon/AlgaeBioreactors';
import {expect} from 'chai';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Phase} from '../../../src/common/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../src/common/constants';

describe('AlgaeBioreactors', () => {
  let player: TestPlayer;
  let card: AlgaeBioreactors;
  let game: IGame;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new AlgaeBioreactors();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({plants: 1});
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.production.override({plants: 0});
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({plants: 1});
    expect(player.getTerraformRating()).eq(14);
    expect(game.getOxygenLevel()).eq(0);
    moonData.habitatRate = 0;

    card.play(player);

    expect(player.production.plants).eq(0);
    expect(moonData.habitatRate).eq(1);
    expect(game.getOxygenLevel()).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });

  it('canPlay when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.production.override({plants: 1});

    testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
    moonData.habitatRate = 8;
    testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  });
});

