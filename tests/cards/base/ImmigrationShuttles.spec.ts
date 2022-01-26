import {expect} from 'chai';
import {ImmigrationShuttles} from '../../../src/cards/base/ImmigrationShuttles';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('ImmigrationShuttles', function() {
  it('Should play', function() {
    const card = new ImmigrationShuttles();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
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
