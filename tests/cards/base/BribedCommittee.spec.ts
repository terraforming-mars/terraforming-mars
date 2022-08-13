import {expect} from 'chai';
import {BribedCommittee} from '../../../src/server/cards/base/BribedCommittee';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('BribedCommittee', function() {
  it('Should play', function() {
    const card = new BribedCommittee();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(-2);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
