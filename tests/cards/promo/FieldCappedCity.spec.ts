import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/server/cards/promo/FieldCappedCity';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('FieldCappedCity', function() {
  it('Should play', function() {
    const card = new FieldCappedCity();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});

