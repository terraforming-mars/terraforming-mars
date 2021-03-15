import {expect} from 'chai';
import {BribedCommittee} from '../../../src/cards/base/BribedCommittee';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('BribedCommittee', function() {
  it('Should play', function() {
    const card = new BribedCommittee();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    card.play(player);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
