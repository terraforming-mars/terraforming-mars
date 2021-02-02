import {expect} from 'chai';
import {RoverConstruction} from '../../../src/cards/base/RoverConstruction';
import {Game} from '../../../src/Game';
import {TestingUtils, TestPlayers} from '../../TestingUtils';

describe('RoverConstruction', function() {
  it('Should play', function() {
    const card = new RoverConstruction();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    player.playedCards.push(card);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runAllActions(game);
    expect(game.getCitiesInPlay()).to.eq(1);
    expect(player.megaCredits).to.eq(2);
  });
});
