import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {HostileTakeover} from '../../../src/server/cards/moon/HostileTakeover';
import {TestPlayer} from '../../TestPlayer';
import {VictoryPointsBreakdown} from '../../../src/server/game/VictoryPointsBreakdown';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';
import {IPlayer} from '../../../src/server/IPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('HostileTakeover', () => {
  let player: TestPlayer;
  let game: IGame;
  let opponent: TestPlayer;
  let card: HostileTakeover;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player, opponent] = testGame(2, {moonExpansion: true});
    card = new HostileTakeover();
    moonData = MoonExpansion.moonData(player.game);
  });

  const canPlayRuns = [
    {habitatRate: 0, miningRate: 0, habitatTiles: false, miningTiles: false, roadTiles: false, expected: false},
    {habitatRate: 2, miningRate: 3, habitatTiles: true, miningTiles: true, roadTiles: false, expected: false},
    {habitatRate: 1, miningRate: 4, habitatTiles: true, miningTiles: true, roadTiles: false, expected: false},
    {habitatRate: 2, miningRate: 4, habitatTiles: true, miningTiles: false, roadTiles: false, expected: false},
    {habitatRate: 2, miningRate: 4, habitatTiles: false, miningTiles: true, roadTiles: false, expected: false},
    {habitatRate: 2, miningRate: 4, habitatTiles: true, miningTiles: true, roadTiles: false, expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('can play ' + JSON.stringify(run), () => {
      moonData.habitatRate = run.habitatRate;
      moonData.miningRate = run.miningRate;

      // Player's tiles don't impact the card.
      MoonExpansion.addHabitatTile(player, 'm02');
      MoonExpansion.addMineTile(player, 'm03');
      MoonExpansion.addRoadTile(player, 'm04');

      if (run.habitatTiles) {
        MoonExpansion.addHabitatTile(opponent, 'm05');
      }
      if (run.miningTiles) {
        MoonExpansion.addMineTile(opponent, 'm06');
      }
      if (run.roadTiles) {
        MoonExpansion.addRoadTile(opponent, 'm07');
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    MoonExpansion.addHabitatTile(player, 'm02');
    MoonExpansion.addMineTile(player, 'm03');
    MoonExpansion.addRoadTile(player, 'm04');
    MoonExpansion.addHabitatTile(opponent, 'm05');
    MoonExpansion.addMineTile(opponent, 'm06');
    MoonExpansion.addRoadTile(opponent, 'm07');
    MoonExpansion.addHabitatTile(opponent, 'm08');
    MoonExpansion.addMineTile(opponent, 'm09');
    MoonExpansion.addRoadTile(opponent, 'm10');

    const habitatSpace = moonData.moon.getSpaceOrThrow('m05');
    const miningSpace = moonData.moon.getSpaceOrThrow('m06');

    const selectHabitatSpace = cast(card.play(player), SelectSpace);
    expect(selectHabitatSpace.spaces.map((s) => s.id)).deep.eq(['m05', 'm08']);

    const selectMineSpace = cast(selectHabitatSpace.cb(habitatSpace), SelectSpace);
    expect(selectMineSpace.spaces.map((s) => s.id)).deep.eq(['m06', 'm09']);

    cast(selectMineSpace.cb(miningSpace), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(habitatSpace.coOwner).eq(player);
    expect(habitatSpace.player).eq(opponent);
    expect(miningSpace.coOwner).eq(player);
    expect(miningSpace.player).eq(opponent);
  });

  // it('compatible with Astra Mechanica', () => {

  // });

  describe('Compatible with Lunar Mine Urbanization', () => {
    const canPlayRuns = [
      {habitatTiles: false, miningTiles: false, expected: false},
      {habitatTiles: false, miningTiles: true, expected: true},
      {habitatTiles: true, miningTiles: false, expected: true},
      {habitatTiles: true, miningTiles: true, expected: true},
    ] as const;

    for (const run of canPlayRuns) {
      it('can play ' + JSON.stringify(run), () => {
        moonData.habitatRate = 2;
        moonData.miningRate = 4;

        if (run.habitatTiles) {
          MoonExpansion.addHabitatTile(opponent, 'm05');
        }
        if (run.miningTiles) {
          MoonExpansion.addMineTile(opponent, 'm06');
        }
        MoonExpansion.addTile(opponent, 'm07', {tileType: TileType.LUNAR_MINE_URBANIZATION});
        expect(card.canPlay(player)).eq(run.expected);
      });
    }

    const playRuns = [
      {habitat: {tile: true, expected: ['m05', 'm07'], selected: 'm05'}, mine: {tile: true, expected: ['m06', 'm07']}},
      {habitat: {tile: true, expected: ['m05', 'm07'], selected: 'm07'}, mine: {tile: true, expected: ['m06']}},
      {habitat: {tile: true, expected: ['m05'], selected: 'm05'}, mine: {tile: false, expected: ['m07']}},
      {habitat: {tile: false, expected: ['m07'], selected: 'm07'}, mine: {tile: true, expected: ['m06']}},
      {habitat: {tile: true, expected: ['m05', 'm07'], selected: 'm05'}, mine: {tile: true, expected: ['m06', 'm07']}},
      {habitat: {tile: true, expected: ['m05', 'm07'], selected: 'm07'}, mine: {tile: true, expected: ['m06']}},
    ] as const;

    for (const run of playRuns) {
      it('play ' + JSON.stringify(run), () => {
        if (run.habitat.tile) {
          MoonExpansion.addHabitatTile(opponent, 'm05');
        }
        if (run.mine.tile) {
          MoonExpansion.addMineTile(opponent, 'm06');
        }
        MoonExpansion.addTile(opponent, 'm07', {tileType: TileType.LUNAR_MINE_URBANIZATION});

        const selectSpace = cast(card.play(player), SelectSpace);

        expect(selectSpace.spaces.map((s) => s.id)).to.have.members(run.habitat.expected);
        const selectMiningSpace = cast(selectSpace.cb(moonData.moon.getSpaceOrThrow(run.habitat.selected)), SelectSpace);
        expect(selectMiningSpace.spaces.map((s) => s.id)).to.have.members(run.mine.expected);
      });
    }
  });

  it('computeVictoryPoints', () => {
    const vps = new VictoryPointsBreakdown();
    function computeVps(player: IPlayer) {
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

    expect(computeVps(player)).eql({habitats: 0, mines: 0, roads: 0});
    expect(computeVps(opponent)).eql({habitats: 0, mines: 0, roads: 0});

    MoonExpansion.addTile(opponent, 'm03', {tileType: TileType.MOON_ROAD});
    MoonExpansion.addTile(opponent, 'm02', {tileType: TileType.MOON_HABITAT});
    MoonExpansion.addTile(opponent, 'm04', {tileType: TileType.MOON_MINE});

    expect(computeVps(player)).eql({habitats: 0, mines: 0, roads: 0});
    expect(computeVps(opponent)).eql({habitats: 1, mines: 1, roads: 1});

    moonData.moon.getSpaceOrThrow('m02').coOwner = player;
    moonData.moon.getSpaceOrThrow('m04').coOwner = player;

    expect(computeVps(player)).eql({habitats: 1, mines: 1, roads: 0});
    expect(computeVps(opponent)).eql({habitats: 1, mines: 1, roads: 1});
  });
});
