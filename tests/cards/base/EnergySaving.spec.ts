import {expect} from 'chai';
import {EnergySaving} from '../../../src/server/cards/base/EnergySaving';
import {testGame} from '../../TestGame';

describe('EnergySaving', function() {
  it('Should play', function() {
    const card = new EnergySaving();
    const [game, player, redPlayer] = testGame(2);
    const action = card.play(player);

    expect(player.production.energy).to.eq(0);
    expect(action).is.undefined;

    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCityTile(redPlayer, game.board.getAvailableSpacesOnLand(redPlayer)[0]);
    card.play(player);

    expect(player.production.energy).to.eq(3);
    expect(redPlayer.production.energy).to.eq(0);
  });
});
