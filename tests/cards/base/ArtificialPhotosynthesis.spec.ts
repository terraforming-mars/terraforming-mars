import {expect} from 'chai';
import {ArtificialPhotosynthesis} from '../../../src/cards/base/ArtificialPhotosynthesis';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('ArtificialPhotosynthesis', () => {
  it('Should play', () => {
    const card = new ArtificialPhotosynthesis();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    player.popWaitingFor(); // Remove SelectInitialCards.
    const action = card.play(player);
    expect(action).is.undefined;
    TestingUtils.runAllActions(game);
    const options = TestingUtils.cast(player.popWaitingFor(), OrOptions);
    expect(options.options).has.lengthOf(2);
    options.options[0].cb();
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    options.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
