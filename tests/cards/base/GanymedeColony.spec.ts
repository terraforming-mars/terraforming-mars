import {expect} from 'chai';
import {GanymedeColony} from '../../../src/cards/base/GanymedeColony';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('GanymedeColony', function() {
  it('Should play', function() {
    const card = new GanymedeColony();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
