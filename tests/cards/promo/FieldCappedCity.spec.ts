import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/server/cards/promo/FieldCappedCity';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('FieldCappedCity', function() {
  it('Should play', function() {
    const card = new FieldCappedCity();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.plants).to.eq(3);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});

