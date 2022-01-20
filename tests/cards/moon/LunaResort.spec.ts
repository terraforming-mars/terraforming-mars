import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {LunaResort} from '../../../src/cards/moon/LunaResort';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaResort', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: IMoonData;
  let card: LunaResort;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaResort();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    player.titanium = 2;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.include(card);

    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    player.titanium = 1;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    player.titanium = 2;
    player.setProductionForTest({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    spaces[1].tile = {tileType: TileType.MOON_ROAD};
    player.titanium = 2;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    player.setProductionForTest({energy: 1, megacredits: 0});
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.colonyRate).eq(1);
  });
});

