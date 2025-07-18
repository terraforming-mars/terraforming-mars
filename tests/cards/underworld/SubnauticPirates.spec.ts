import {expect} from 'chai';
import {SubnauticPirates} from '../../../src/server/cards/underworld/SubnauticPirates';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

describe('SubnauticPirates', () => {
  let card: SubnauticPirates;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new SubnauticPirates();
    [game, player, player2, player3] = testGame(4, {underworldExpansion: true});
  });

  const canPlayRuns = [
    {corruption: 0, tokens: false, expected: false},
    {corruption: 0, tokens: true, expected: false},
    {corruption: 1, tokens: false, expected: false},
    {corruption: 1, tokens: true, expected: false},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.underworldData.corruption = run.corruption;
      if (run.tokens) {
        player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
      }

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('no corruption', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    game.simpleAddTile(player, oceanSpace, {tileType: TileType.OCEAN});

    const adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace);
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.GREENERY});
    player2.megaCredits = 7;

    game.simpleAddTile(player3, adjacentSpaces[1], {tileType: TileType.GREENERY});
    player3.megaCredits = 7;

    const selectPlayer = cast(card.play(player), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player2, player3]);

    cast(selectPlayer.cb(player2), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);
    cast(player3.popWaitingFor(), undefined);

    expect(player.megaCredits).eq(7);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(7);
  });


  it('corruption, block', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    game.simpleAddTile(player, oceanSpace, {tileType: TileType.OCEAN});

    const adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace);
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.GREENERY});
    player2.megaCredits = 8;
    player2.underworldData.corruption = 1;

    const selectPlayer = cast(card.play(player), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player2]);

    cast(selectPlayer.cb(player2), undefined);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    runAllActions(game);
    cast(player3.popWaitingFor(), undefined);

    expect(player.megaCredits).eq(0);
    expect(player2.megaCredits).eq(8);
    expect(player2.underworldData.corruption).eq(0);
  });
});
