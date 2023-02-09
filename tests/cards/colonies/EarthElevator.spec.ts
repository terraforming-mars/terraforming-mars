import {expect} from 'chai';
import {EarthElevator} from '../../../src/server/cards/colonies/EarthElevator';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('EarthElevator', function() {
  it('Should play', function() {
    const card = new EarthElevator();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(4);
  });
});
