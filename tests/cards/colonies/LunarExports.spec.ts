import {expect} from 'chai';
import {LunarExports} from '../../../src/cards/colonies/LunarExports';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const orOptions = card.play(player) as OrOptions;

    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
