import {expect} from 'chai';
import {GanymedeColony} from '../../../src/cards/base/GanymedeColony';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('GanymedeColony', function() {
  it('Should play', function() {
    const card = new GanymedeColony();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
