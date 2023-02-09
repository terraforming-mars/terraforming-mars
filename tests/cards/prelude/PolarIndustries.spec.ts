import {expect} from 'chai';
import {PolarIndustries} from '../../../src/server/cards/prelude/PolarIndustries';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PolarIndustries', function() {
  it('Should play', function() {
    const card = new PolarIndustries();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
  });
});
