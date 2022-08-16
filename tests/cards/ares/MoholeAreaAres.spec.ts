import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {MoholeAreaAres} from '../../../src/server/cards/ares/MoholeAreaAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('MoholeAreaAres', function() {
  it('Should play', function() {
    const card = new MoholeAreaAres();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.MOHOLE_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
  });
});
