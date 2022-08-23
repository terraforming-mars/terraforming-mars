import {expect} from 'chai';
import {ImmigrationShuttles} from '../../../src/server/cards/base/ImmigrationShuttles';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('ImmigrationShuttles', function() {
  it('Should play', function() {
    const card = new ImmigrationShuttles();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(5);
    for (let i = 0; i < 5; i++) {
      game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    }
    expect(game.getCitiesCount()).to.eq(5);
    expect(card.getVictoryPoints(player)).to.eq(1);
    game.addCityTile(redPlayer, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesCount()).to.eq(6);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
