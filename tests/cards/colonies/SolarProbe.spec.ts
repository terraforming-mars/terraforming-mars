import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {SolarProbe} from '../../../src/cards/colonies/SolarProbe';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('SolarProbe', function() {
  it('Should play', function() {
    const card = new SolarProbe();
    const card2 = new Research();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
