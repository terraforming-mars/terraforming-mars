import {expect} from 'chai';
import {SubnauticPirates} from '../../../src/server/cards/underworld/SubnauticPirates';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('SubnauticPirates', () => {
  let card: SubnauticPirates;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new SubnauticPirates();
    [game, player, player2, player3] = testGame(3, {underworldExpansion: true});
  });

  const canPlayRuns = [
    {it: 'case 1', corruption: 0, marker: undefined, expected: false},
    {it: 'case 2', corruption: 0, marker: 'land', expected: false},
    {it: 'case 3', corruption: 0, marker: 'ocean-space', expected: false},
    {it: 'case 4', corruption: 0, marker: 'ocean-tile', expected: false},
    {it: 'case 5', corruption: 1, marker: undefined, expected: false},
    {it: 'case 6', corruption: 1, marker: 'land', expected: false},
    {it: 'case 7', corruption: 1, marker: 'ocean-space', expected: false},
    {it: 'case 8', corruption: 1, marker: 'ocean-tile', expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('canPlay ' + run.it, () => {
      player.underworldData.corruption = run.corruption;

      switch (run.marker) {
      case 'land':
        game.board.getAvailableSpacesOnLand(player)[0].excavator = player;
        break;
      case 'ocean-space':
        game.board.getAvailableSpacesForOcean(player)[0].excavator = player;
        break;
      case 'ocean-tile':
        game.board.getAvailableSpacesForOcean(player)[0].excavator = player;
        game.board.getAvailableSpacesForOcean(player)[0].tile = {tileType: TileType.OCEAN};
        break;
      case undefined:
        break;
      }

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('one excavation space, no corruption', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    oceanSpace.excavator = player;
    game.simpleAddTile(player, oceanSpace, {tileType: TileType.OCEAN});

    const adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace);
    const adjacentSpace2 = adjacentSpaces[0];
    game.simpleAddTile(player2, adjacentSpace2, {tileType: TileType.GREENERY});
    player2.megaCredits = 6;

    const adjacentSpace3 = adjacentSpaces[1];
    game.simpleAddTile(player3, adjacentSpace3, {tileType: TileType.GREENERY});
    player3.megaCredits = 7;

    const selectSpace = cast(card.play(player), SelectSpace);

    expect(selectSpace.spaces).to.have.members([oceanSpace]);

    cast(selectSpace.cb(oceanSpace), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);
    cast(player3.popWaitingFor(), undefined);

    expect(player.megaCredits).eq(12);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(1);
  });


  it('one excavation space, corruption', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    oceanSpace.excavator = player;
    game.simpleAddTile(player, oceanSpace, {tileType: TileType.OCEAN});

    const adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace);
    const adjacentSpace2 = adjacentSpaces[0];
    game.simpleAddTile(player2, adjacentSpace2, {tileType: TileType.GREENERY});
    player2.megaCredits = 6;

    const adjacentSpace3 = adjacentSpaces[1];
    game.simpleAddTile(player3, adjacentSpace3, {tileType: TileType.GREENERY});
    player3.megaCredits = 7;

    player2.underworldData.corruption = 1;
    player3.underworldData.corruption = 1;

    const selectSpace = cast(card.play(player), SelectSpace);

    expect(selectSpace.spaces).to.have.members([oceanSpace]);

    cast(selectSpace.cb(oceanSpace), undefined);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    UnderworldTestHelper.assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    runAllActions(game);
    UnderworldTestHelper.assertIsMaybeBlock(player3, player3.popWaitingFor(), 'do not block');

    expect(player.megaCredits).eq(6);
    expect(player2.megaCredits).eq(6);
    expect(player3.megaCredits).eq(1);
    expect(player2.underworldData.corruption).eq(0);
    expect(player3.underworldData.corruption).eq(1);
  });
});
