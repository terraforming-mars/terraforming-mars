import {expect} from 'chai';
import {LunarExports} from '../../../src/server/cards/colonies/LunarExports';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const [game, player] = testGame(1);
    card.play(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    orOptions.options[0].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 5}));

    player.production.override(Units.EMPTY);

    orOptions.options[1].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 2}));
  });
});
