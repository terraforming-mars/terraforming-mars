import {expect} from 'chai';
import {LunarExports} from '../../../src/server/cards/colonies/LunarExports';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const orOptions = cast(card.play(player), OrOptions);

    orOptions.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
