import {expect} from 'chai';
import {LunarExports} from '../../../src/cards/colonies/LunarExports';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {cast} from '../../TestingUtils';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const orOptions = cast(card.play(player), OrOptions);

    orOptions.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
