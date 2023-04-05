import {expect} from 'chai';
import {RoverConstruction} from '../../../src/server/cards/base/RoverConstruction';
import {Game} from '../../../src/server/Game';
import {addCityTile, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('RoverConstruction', function() {
  it('Should play', function() {
    const card = new RoverConstruction();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(1);
    player.playedCards.push(card);
    addCityTile(player);
    runAllActions(game);
    expect(game.getCitiesCount()).to.eq(1);
    expect(player.megaCredits).to.eq(2);
  });
});
