import {expect} from 'chai';
import {MetalRichAsteroid} from '../../../src/cards/prelude/MetalRichAsteroid';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Metal-RichAsteroid', function() {
  it('Should play', function() {
    const card = new MetalRichAsteroid();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(4);
    expect(player.steel).to.eq(4);
    expect(game.getTemperature()).to.equal(-28);
  });
});
