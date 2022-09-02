import {expect} from 'chai';
import {EarthElevator} from '../../../src/server/cards/colonies/EarthElevator';
import {TestPlayer} from '../../TestPlayer';

describe('EarthElevator', function() {
  it('Should play', function() {
    const card = new EarthElevator();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(4);
  });
});
