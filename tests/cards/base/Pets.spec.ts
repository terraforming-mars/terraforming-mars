import {expect} from 'chai';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Game} from '../../../src/server/Game';
import {addCity, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('Pets', function() {
  it('Should play', function() {
    const card = new Pets();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    player.playedCards.push(card);
    const game = Game.newInstance('gameid', [player, player2], player);
    cast(card.play(player), undefined);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints(player)).to.eq(2);
    addCity(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(6);
  });
});
