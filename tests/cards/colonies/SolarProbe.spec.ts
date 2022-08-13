import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SolarProbe} from '../../../src/server/cards/colonies/SolarProbe';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SolarProbe', function() {
  it('Should play', function() {
    const card = new SolarProbe();
    const card2 = new Research();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.playedCards.push(card2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
