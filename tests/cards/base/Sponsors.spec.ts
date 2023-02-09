import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
