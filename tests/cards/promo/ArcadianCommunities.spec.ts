import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {ArcadianCommunities} from '../../../src/server/cards/promo/ArcadianCommunities';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';
import {MarsBoard} from '../../../src/server/boards/MarsBoard';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('ArcadianCommunities', function() {
  let card: ArcadianCommunities;
  let player: TestPlayer;
  let board: MarsBoard;

  beforeEach(() => {
    card = new ArcadianCommunities();
    [/* skipped */, player] = testGame(2);
    player.setCorporationForTest(card);
    board = player.game.board;
  });

  it('initial action', () => {
    const action = cast(card.initialAction(player), SelectSpace);
    const space = action.spaces[0];
    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    action.cb(space);

    expect(space.tile).is.undefined;
    expect(space.player).eq(player);
    expect(player.megaCredits).to.eq(0);
  });

  it('play', () => {
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.steel).to.eq(10);
  });

  it('action + effect', () => {
    // Select an initial space next to which the action will occur.
    const initLands = board.getAvailableSpacesForGreenery(player);
    initLands[0].player = player;

    const action = cast(card.action(player), SelectSpace);
    const space = action.spaces[0];

    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    action.cb(space);

    expect(space.tile).is.undefined;
    expect(space.player).eq(player);
    expect(player.megaCredits).to.eq(0);

    // This describes the effect.
    player.game.addCity(player, space);
    runAllActions(player.game);
    expect(player.megaCredits).to.eq(3);
  });

  it('available spaces do not include those where player already has token', () => {
    // Spaces 10 and 11 are valid, adjacent spaces.
    const first = board.getSpace('10');
    expect(first.spaceType).eq(SpaceType.LAND);

    const second = board.getSpace('11');
    expect(second.spaceType).eq(SpaceType.LAND);

    const neighbor = board.getSpace('05');
    expect(neighbor.spaceType).eq(SpaceType.LAND);

    expect(board.getAdjacentSpaces(first)).contains(second);
    expect(board.getAdjacentSpaces(second)).contains(neighbor);
    expect(board.getAdjacentSpaces(neighbor)).contains(first);

    neighbor.player = player;

    expect(cast(card.action(player), SelectSpace).spaces).contains(first);
    expect(cast(card.action(player), SelectSpace).spaces).contains(second);

    first.player = player;

    expect(cast(card.action(player), SelectSpace).spaces).does.not.contain(first);
    expect(cast(card.action(player), SelectSpace).spaces).does.contain(second);
  });
});
