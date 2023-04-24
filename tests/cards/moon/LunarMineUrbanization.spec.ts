import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast} from '../../TestingUtils';
import {LunarMineUrbanization} from '../../../src/server/cards/moon/LunarMineUrbanization';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {VictoryPointsBreakdown} from '../../../src/server/VictoryPointsBreakdown';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('LunarMineUrbanization', () => {
  let player: TestPlayer;
  let card: LunarMineUrbanization;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    card = new LunarMineUrbanization();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.not.include(card);

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;
    expect(player.getPlayableCards()).does.include(card);

    space.player = undefined;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];
    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;

    player.production.override({megacredits: 0});
    moonData.colonyRate = 0;
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    const action = cast(card.play(player), SelectSpace);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([]);
    expect(player.production.megacredits).eq(1);

    action.cb(space);

    expect(space.tile!.tileType).eq(TileType.LUNAR_MINE_URBANIZATION);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([space]);
    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can play, compatible with Odyssey', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const [space, nextSpace] = moonData.moon.getAvailableSpacesOnLand(player);

    expect(player.getPlayableCards()).does.not.include(card);

    space.tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    space.player = player;
    expect(player.getPlayableCards()).does.not.include(card);

    nextSpace.tile = {tileType: TileType.MOON_MINE};
    nextSpace.player = player;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play, compatible with Odyssey', () => {
    const [priorLMUSpace, space] = moonData.moon.getAvailableSpacesOnLand(player);

    priorLMUSpace.tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    priorLMUSpace.player = player;

    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;

    player.production.override({megacredits: 0});
    moonData.colonyRate = 0;
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    const action = cast(card.play(player), SelectSpace);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([priorLMUSpace, space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([priorLMUSpace]);
    expect(player.production.megacredits).eq(1);

    action.cb(space);

    expect(space.tile!.tileType).eq(TileType.LUNAR_MINE_URBANIZATION);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([priorLMUSpace, space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([priorLMUSpace, space]);
    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('computeVictoryPoints', () => {
    const vps = new VictoryPointsBreakdown();
    function computeVps() {
      vps.points.moonHabitats = 0;
      vps.points.moonMines = 0;
      vps.points.moonRoads = 0;
      MoonExpansion.calculateVictoryPoints(player, vps);
      return {
        habitats: vps.points.moonHabitats,
        mines: vps.points.moonMines,
        roads: vps.points.moonRoads,
      };
    }

    expect(computeVps()).eql({habitats: 0, mines: 0, roads: 0});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});
    MoonExpansion.calculateVictoryPoints(player, vps);
    expect(computeVps()).eql({habitats: 0, mines: 0, roads: 1});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.LUNAR_MINE_URBANIZATION});

    expect(computeVps()).eql({habitats: 1, mines: 1, roads: 1});
  });
});
