import {expect} from 'chai';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {CometForVenus} from '../../../src/cards/venusNext/CometForVenus';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';

describe('CometForVenus', function() {
  it('Should play', function() {
    const card = new CometForVenus();
    const card2 = new AerialMappers();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    player2.megaCredits = 10;
    player2.playedCards.push(card2);

    const action = card.play(player) as OrOptions;

    expect(action.options).has.lengthOf(2);

    const subActionSelectPlayer: SelectPlayer = action!.options[0] as SelectPlayer;

    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);
    subActionSelectPlayer.cb(player2);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
