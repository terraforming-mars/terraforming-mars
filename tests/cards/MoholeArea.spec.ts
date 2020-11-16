
import {expect} from 'chai';
import {MoholeArea} from '../../src/cards/MoholeArea';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {SelectSpace} from '../../src/inputs/SelectSpace';
import {TileType} from '../../src/TileType';
import {Resources} from '../../src/Resources';

describe('MoholeArea', function() {
  it('Should play', function() {
    const card = new MoholeArea();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);

    expect(action).is.not.undefined;
    expect(action instanceof SelectSpace).is.true;

    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.MOHOLE_AREA);
    expect(player.getProduction(Resources.HEAT)).to.eq(4);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
