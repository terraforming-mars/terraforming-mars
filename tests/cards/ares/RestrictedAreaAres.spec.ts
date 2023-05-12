import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {RestrictedAreaAres} from '../../../src/server/cards/ares/RestrictedAreaAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('RestrictedAreaAres', function() {
  let card: RestrictedAreaAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RestrictedAreaAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', function() {
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.DRAW_CARD]});
  });
});
