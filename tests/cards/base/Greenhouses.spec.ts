
import {expect} from 'chai';
import {Greenhouses} from '../../../src/cards/base/Greenhouses';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('Greenhouses', function() {
  it('Should play', function() {
    const card = new Greenhouses();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.plants).to.eq(0);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    card.play(player, game);
    expect(player.plants).to.eq(1);
  });
});
