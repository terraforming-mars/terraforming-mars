import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/server/cards/promo/FieldCappedCity';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('FieldCappedCity', function() {
  it('Should play', function() {
    const card = new FieldCappedCity();
    const [/* game */, player] = testGame(2);
    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);
    expect(action.spaces[0].tile && action.spaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});

