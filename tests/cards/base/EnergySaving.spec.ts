import {expect} from 'chai';
import {EnergySaving} from '../../../src/server/cards/base/EnergySaving';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('EnergySaving', () => {
  it('Should play', () => {
    const card = new EnergySaving();
    const [game, player, redPlayer] = testGame(2);
    const action = card.play(player);

    expect(player.production.energy).to.eq(0);
    cast(action, undefined);

    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCity(redPlayer, game.board.getAvailableSpacesOnLand(redPlayer)[0]);
    card.play(player);

    expect(player.production.energy).to.eq(3);
    expect(redPlayer.production.energy).to.eq(0);
  });
});
