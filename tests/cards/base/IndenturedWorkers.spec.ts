import {expect} from 'chai';
import {IndenturedWorkers} from '../../../src/cards/base/IndenturedWorkers';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('IndenturedWorkers', function() {
  it('Should apply card discount until next card played', function() {
    const card = new IndenturedWorkers();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    expect(card.getCardDiscount(player, game)).to.eq(0);
  });
});
