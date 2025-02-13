import {expect} from 'chai';
import {Greenhouses} from '../../../src/server/cards/base/Greenhouses';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Greenhouses', () => {
  it('Should play', () => {
    const card = new Greenhouses();
    const [game, player, player2] = testGame(2);
    const action = card.play(player);

    cast(action, undefined);
    expect(player.plants).to.eq(0);

    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    game.addCity(player2, game.board.getAvailableSpacesOnLand(player2)[0]);
    card.play(player);

    expect(player.plants).to.eq(3);
    expect(player2.plants).to.eq(0);
  });
});
