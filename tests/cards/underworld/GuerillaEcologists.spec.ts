import {expect} from 'chai';
import {GuerillaEcologists} from '../../../src/server/cards/underworld/GuerillaEcologists';
import {testGame} from '../../TestGame';
import {addGreenery, cast, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';

describe('GuerillaEcologists', () => {
  const canPlayRuns = [
    {corruption: 0, plants: 3, roomForGreenery: true, expected: false},
    {corruption: 1, plants: 3, roomForGreenery: true, expected: false},
    {corruption: 0, plants: 4, roomForGreenery: true, expected: false},
    {corruption: 1, plants: 4, roomForGreenery: true, expected: true},
    {corruption: 1, plants: 4, roomForGreenery: false, expected: false},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new GuerillaEcologists();
      const [game, player] = testGame(2);

      if (run.roomForGreenery === false) {
        for (const space of game.board.getAvailableSpacesForGreenery(player)) {
          space.tile = {tileType: TileType.CITY};
        }
      }
      player.underworldData.corruption = run.corruption;
      player.plants = run.plants;
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new GuerillaEcologists();
    const [game, player] = testGame(2);
    game.board = EmptyBoard.newInstance();

    player.plants = 4;
    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.GREENERY);
    expect(space.player).eq(player);
    expect(player.plants).eq(0);
  });

  it('play with Viral Enhancers', () => {
    const card = new GuerillaEcologists();
    const [game, player] = testGame(2);
    game.board = EmptyBoard.newInstance();

    player.plants = 3;
    player.underworldData.corruption = 1;

    expect(card.canPlay(player)).is.false;

    player.playedCards.push(new ViralEnhancers());

    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.GREENERY);
    expect(space.player).eq(player);
    expect(player.plants).eq(0);
  });

  it('Can place greenery tile on any available land space, not just adjacent to exising greenery', () => {
    const card = new GuerillaEcologists();
    const [game, player] = testGame(2);
    game.board = EmptyBoard.newInstance();
    player.plants = 4;
    addGreenery(player, '35');
    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces.length).greaterThan(6);
  });
});
