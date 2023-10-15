import {expect} from 'chai';
import {LunarExports} from '../../../src/server/cards/colonies/LunarExports';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
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
