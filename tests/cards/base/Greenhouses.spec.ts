import {expect} from 'chai';
import {Greenhouses} from '../../../src/server/cards/base/Greenhouses';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Greenhouses', function() {
  it('Should play', function() {
    const card = new Greenhouses();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.plants).to.eq(0);

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addCityTile(redPlayer, game.board.getAvailableSpacesOnLand(redPlayer)[0].id);
    card.play(player);

    expect(player.plants).to.eq(3);
    expect(redPlayer.plants).to.eq(0);
  });
});
