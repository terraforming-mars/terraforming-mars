import {expect} from 'chai';
import {ArtificialPhotosynthesis} from '../../../src/server/cards/base/ArtificialPhotosynthesis';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';

describe('ArtificialPhotosynthesis', () => {
  it('Should play', () => {
    const card = new ArtificialPhotosynthesis();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    player.popWaitingFor(); // Remove SelectInitialCards.
    const action = card.play(player);
    expect(action).is.undefined;
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.options).has.lengthOf(2);
    options.options[0].cb();
    expect(player.production.energy).to.eq(2);
    options.options[1].cb();
    expect(player.production.plants).to.eq(1);
  });
});
