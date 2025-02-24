import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {LunarMineUrbanization} from '../../../src/server/cards/moon/LunarMineUrbanization';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {VictoryPointsBreakdownBuilder} from '../../../src/server/game/VictoryPointsBreakdownBuilder';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TheGrandLunaCapitalGroup} from '../../../src/server/cards/moon/TheGrandLunaCapitalGroup';

describe('LunarMineUrbanization', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: LunarMineUrbanization;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {moonExpansion: true});
    card = new LunarMineUrbanization();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.not.include(card);

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;
    expect(player.getPlayableCardsForTest()).does.include(card);

    space.player = undefined;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];
    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;
    space.bonus = [SpaceBonus.HEAT];

    player.production.override({megacredits: 0});
    moonData.habitatRate = 0;
    expect(player.getTerraformRating()).eq(20);
    expect(player.heat).eq(0);
    player.titanium = 1;

    const action = cast(card.play(player), SelectSpace);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([]);
    expect(player.production.megacredits).eq(1);

    action.cb(space);

    expect(space.tile!.tileType).eq(TileType.LUNAR_MINE_URBANIZATION);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([space]);
    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(21);
    expect(player.heat).eq(1); // Ensures placement bonus.
  });

  it('can play, compatible with Odyssey', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const [space, nextSpace] = moonData.moon.getAvailableSpacesOnLand(player);

    expect(player.getPlayableCardsForTest()).does.not.include(card);

    space.tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    space.player = player;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    nextSpace.tile = {tileType: TileType.MOON_MINE};
    nextSpace.player = player;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play, compatible with Odyssey', () => {
    const [priorLMUSpace, space] = moonData.moon.getAvailableSpacesOnLand(player);

    priorLMUSpace.tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    priorLMUSpace.player = player;

    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;

    player.production.override({megacredits: 0});
    moonData.habitatRate = 0;
    expect(player.getTerraformRating()).eq(20);
    player.titanium = 1;

    const action = cast(card.play(player), SelectSpace);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([priorLMUSpace, space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([priorLMUSpace]);
    expect(player.production.megacredits).eq(1);

    action.cb(space);

    expect(space.tile!.tileType).eq(TileType.LUNAR_MINE_URBANIZATION);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([priorLMUSpace, space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([priorLMUSpace, space]);
    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('computeVictoryPoints', () => {
    function computeVps() {
      const builder = new VictoryPointsBreakdownBuilder();
      MoonExpansion.calculateVictoryPoints(player, builder);
      const vps = builder.build();
      return {
        habitats: vps.moonHabitats,
        mines: vps.moonMines,
        roads: vps.moonRoads,
      };
    }

    expect(computeVps()).eql({habitats: 0, mines: 0, roads: 0});

    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});

    expect(computeVps()).eql({habitats: 0, mines: 0, roads: 1});

    MoonExpansion.addTile(player, 'm03', {tileType: TileType.LUNAR_MINE_URBANIZATION});

    expect(computeVps()).eql({habitats: 1, mines: 1, roads: 1});
  });

  it('Is compatible with the Grand Lunar Capital Group, #6648, place LMU', () => {
    player.corporations.push(new TheGrandLunaCapitalGroup());
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_HABITAT});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_MINE});
    card.play(player);
    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.id).eq('m03');
    expect(player.megaCredits).eq(0);

    selectSpace.cb(space);

    expect(player.megaCredits).eq(2);
  });

  it('Is compatible with the Grand Lunar Capital Group, #6648, place next to LMU', () => {
    player.corporations.push(new TheGrandLunaCapitalGroup());
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.LUNAR_MINE_URBANIZATION});

    expect(player.megaCredits).eq(0);

    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_HABITAT});

    expect(player.megaCredits).eq(2);
  });

  it('Can be played on Hostile Takeover space, #6982', () => {
    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];
    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player2;
    space.coOwner = player;

    const action = cast(card.play(player), SelectSpace);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_HABITAT)).eql([]);

    action.cb(space);

    expect(space.player!.id).eq(player2.id);
    expect(space.coOwner!.id).eq(player.id);
  });
});
