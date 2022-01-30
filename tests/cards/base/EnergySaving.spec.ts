import {expect} from 'chai';
import {EnergySaving} from '../../../src/cards/base/EnergySaving';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('EnergySaving', function() {
  it('Should play', function() {
    const card = new EnergySaving();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(action).is.undefined;

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addCityTile(redPlayer, game.board.getAvailableSpacesOnLand(redPlayer)[0].id);
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    expect(redPlayer.getProduction(Resources.ENERGY)).to.eq(0);
  });
});
