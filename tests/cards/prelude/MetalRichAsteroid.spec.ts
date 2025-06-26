import {expect} from 'chai';
import {MetalRichAsteroid} from '../../../src/server/cards/prelude/MetalRichAsteroid';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Metal-RichAsteroid', () => {
  it('Should play', () => {
    const card = new MetalRichAsteroid();
    const [game, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.titanium).to.eq(4);
    expect(player.steel).to.eq(4);
    expect(game.getTemperature()).to.equal(-28);
  });
});
