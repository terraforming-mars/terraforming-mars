import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {RestrictedAreaAres} from '../../../src/server/cards/ares/RestrictedAreaAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('RestrictedAreaAres', () => {
  let card: RestrictedAreaAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new RestrictedAreaAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.DRAW_CARD]});
  });
});
