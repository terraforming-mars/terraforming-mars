import {expect} from 'chai';
import {MetalRichAsteroid} from '../../../src/server/cards/prelude/MetalRichAsteroid';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Metal-RichAsteroid', function() {
  it('Should play', function() {
    const card = new MetalRichAsteroid();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(4);
    expect(player.steel).to.eq(4);
    expect(game.getTemperature()).to.equal(-28);
  });
});
