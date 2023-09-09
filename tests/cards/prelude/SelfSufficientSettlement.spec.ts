import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SelfSufficientSettlement} from '../../../src/server/cards/prelude/SelfSufficientSettlement';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('SelfSufficientSettlement', function() {
  it('Should play', function() {
    const [game, player] = testGame(1);
    const card = new SelfSufficientSettlement();

    expect(player.production.asUnits()).deep.eq(Units.of({}));

    const action = card.play(player);
    runAllActions(game);
    cast(action, undefined);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.player).is.undefined;
    expect(space.tile).is.undefined;

    selectSpace.cb(space);

    expect(space.player).eq(player);
    expect(space.tile?.tileType).eq(TileType.CITY);
  });
});
