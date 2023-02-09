import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelfSufficientSettlement} from '../../../src/server/cards/prelude/SelfSufficientSettlement';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('SelfSufficientSettlement', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new SelfSufficientSettlement();

    expect(player.production.asUnits()).deep.eq(Units.of({}));

    const action = card.play(player);
    runAllActions(game);
    expect(action).is.undefined;

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.availableSpaces[0];

    expect(space.player).is.undefined;
    expect(space.tile).is.undefined;

    selectSpace.cb(space);

    expect(space.player).eq(player);
    expect(space.tile?.tileType).eq(TileType.CITY);
  });
});
