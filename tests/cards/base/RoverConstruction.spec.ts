import {expect} from 'chai';
import {RoverConstruction} from '../../../src/server/cards/base/RoverConstruction';
import {Game} from '../../../src/server/Game';
import {addCity, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('RoverConstruction', function() {
  it('Should play', function() {
    const card = new RoverConstruction();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    player.playedCards.push(card);
    addCity(player);
    runAllActions(game);
    expect(game.board.getCities()).has.length(1);
    expect(player.megaCredits).to.eq(2);
  });
});
