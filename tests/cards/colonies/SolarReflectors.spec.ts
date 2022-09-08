import {expect} from 'chai';
import {SolarReflectors} from '../../../src/server/cards/colonies/SolarReflectors';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SolarReflectors', function() {
  it('Should play', function() {
    const card = new SolarReflectors();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(5);
  });
});
