import {expect} from 'chai';
import {Greenhouses} from '../../../src/cards/base/Greenhouses';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Greenhouses', function() {
  it('Should play', function() {
    const card = new Greenhouses();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
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
