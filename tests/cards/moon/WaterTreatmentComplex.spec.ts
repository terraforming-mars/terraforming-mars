import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {WaterTreatmentComplex} from '../../../src/cards/moon/WaterTreatmentComplex';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('WaterTreatmentComplex', () => {
  let player: Player;
  let card: WaterTreatmentComplex;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new WaterTreatmentComplex();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    player.titanium = 1;
    space.tile = {tileType: TileType.MOON_COLONY};
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    space.tile = {tileType: TileType.MOON_COLONY};
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    space.tile = {tileType: TileType.MOON_ROAD};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    expect(moonData.colonyRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(moonData.colonyRate).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });
});

