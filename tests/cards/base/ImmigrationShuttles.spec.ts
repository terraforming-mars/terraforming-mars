import {expect} from 'chai';
import {ImmigrationShuttles} from '../../../src/server/cards/base/ImmigrationShuttles';
import {testGame} from '../../TestGame';

describe('ImmigrationShuttles', function() {
  it('Should play', function() {
    const card = new ImmigrationShuttles();
    const [game, player, player2] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(5);
    for (let i = 0; i < 5; i++) {
      game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0]);
    }
    expect(game.getCitiesCount()).to.eq(5);
    expect(card.getVictoryPoints(player)).to.eq(1);
    game.addCityTile(player2, game.board.getAvailableSpacesOnLand(player)[0]);
    expect(game.getCitiesCount()).to.eq(6);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
