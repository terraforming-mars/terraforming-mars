import {expect} from 'chai';
import {EarthElevator} from '../../../src/server/cards/colonies/EarthElevator';
import {testGame} from '../../TestGame';

describe('EarthElevator', function() {
  it('Should play', function() {
    const card = new EarthElevator();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(4);
  });
});
