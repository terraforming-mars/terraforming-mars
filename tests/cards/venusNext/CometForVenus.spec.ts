import {expect} from 'chai';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {CometForVenus} from '../../../src/cards/venusNext/CometForVenus';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('CometForVenus', function() {
  it('Should play', function() {
    const card = new CometForVenus();
    const card2 = new AerialMappers();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    player2.megaCredits = 10;
    player2.playedCards.push(card2);

    const play = card.play(player);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
