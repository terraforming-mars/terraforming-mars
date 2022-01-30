
import {expect} from 'chai';
import {ArtificialPhotosynthesis} from '../../../src/cards/base/ArtificialPhotosynthesis';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('ArtificialPhotosynthesis', () => {
  it('Should play', () => {
    const card = new ArtificialPhotosynthesis();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const action = card.play(player);
    expect(action).is.not.undefined;
    expect(action).instanceOf(OrOptions);
    expect(action.options).has.lengthOf(2);
    action.options[0].cb();
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    action.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
