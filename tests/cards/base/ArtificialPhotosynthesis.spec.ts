import {expect} from 'chai';
import {ArtificialPhotosynthesis} from '../../../src/server/cards/base/ArtificialPhotosynthesis';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ArtificialPhotosynthesis', () => {
  it('Should play', () => {
    const card = new ArtificialPhotosynthesis();
    const [game, player] = testGame(1);
    cast(card.play(player), undefined);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.options).has.lengthOf(2);
    options.options[0].cb();
    expect(player.production.energy).to.eq(2);
    options.options[1].cb();
    expect(player.production.plants).to.eq(1);
  });
});
