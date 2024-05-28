import {expect} from 'chai';
import {RoverConstruction} from '../../../src/server/cards/base/RoverConstruction';
import {addCity, runAllActions} from '../../TestingUtils';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('RoverConstruction', function() {
  it('Should play', function() {
    const card = new RoverConstruction();
    const [game, player/* , player2 */] = testGame(2);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    player.playedCards.push(card);
    addCity(player);
    runAllActions(game);
    expect(game.board.getCities()).has.length(1);
    expect(player.megaCredits).to.eq(2);
  });
});
