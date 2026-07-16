import {expect} from 'chai';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {CometForVenus} from '../../../src/server/cards/venusNext/CometForVenus';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {cast} from '../../TestingUtils';

describe('CometForVenus', () => {
  it('Should play', () => {
    const card = new CometForVenus();
    const card2 = new AerialMappers();
    const [game, player, player2] = testGame(2);
    player2.megaCredits = 10;
    player2.playedCards.push(card2);

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(2);

    const subActionSelectPlayer= cast(action.options[0], SelectPlayer);

    expect(subActionSelectPlayer.players).has.lengthOf(1);
    expect(subActionSelectPlayer.players[0]).to.eq(player2);
    subActionSelectPlayer.cb(player2);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
