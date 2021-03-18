import {expect} from 'chai';
import {Pets} from '../../../src/cards/base/Pets';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Pets', function() {
  it('Should play', function() {
    const card = new Pets();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    player.playedCards.push(card);
    const game = Game.newInstance('foobar', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints()).to.eq(2);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    TestingUtils.runAllActions(game);
    expect(card.resourceCount).to.eq(6);
  });
});
