import {expect} from 'chai';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('GanymedeColony', function() {
  it('Should play', function() {
    const card = new GanymedeColony();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
