import {expect} from 'chai';
import {TerraformingGanymede} from '../../../src/cards/base/TerraformingGanymede';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('TerraformingGanymede', function() {
  it('Should play', function() {
    const card = new TerraformingGanymede();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    player.playedCards.push(card);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
