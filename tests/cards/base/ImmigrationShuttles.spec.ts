import {expect} from 'chai';
import {ImmigrationShuttles} from '../../../src/server/cards/base/ImmigrationShuttles';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('ImmigrationShuttles', () => {
  it('Should play', () => {
    const card = new ImmigrationShuttles();
    const [game, player, player2] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(5);
    for (let i = 0; i < 5; i++) {
      game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    }
    expect(game.board.getCities()).has.length(5);
    expect(card.getVictoryPoints(player)).to.eq(1);
    game.addCity(player2, game.board.getAvailableSpacesOnLand(player)[0]);
    expect(game.board.getCities()).has.length(6);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
