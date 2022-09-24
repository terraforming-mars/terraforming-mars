import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {WaterTreatmentComplex} from '../../../src/server/cards/moon/WaterTreatmentComplex';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

describe('WaterTreatmentComplex', () => {
  let player: Player;
  let card: WaterTreatmentComplex;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new WaterTreatmentComplex();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    player.titanium = 1;
    space.tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    space.tile = {tileType: TileType.MOON_HABITAT};
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

