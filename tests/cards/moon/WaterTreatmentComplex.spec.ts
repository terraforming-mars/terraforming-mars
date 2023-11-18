import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {WaterTreatmentComplex} from '../../../src/server/cards/moon/WaterTreatmentComplex';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';

describe('WaterTreatmentComplex', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: WaterTreatmentComplex;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new WaterTreatmentComplex();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    player.titanium = 1;
    space.tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 0;
    space.tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    space.tile = {tileType: TileType.MOON_ROAD};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    expect(moonData.habitatRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(moonData.habitatRate).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });
});

