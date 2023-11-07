import {expect} from 'chai';
import {EarthElevator} from '../../../src/server/cards/colonies/EarthElevator';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('EarthElevator', function() {
  it('Should play', function() {
    const card = new EarthElevator();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(4);
  });
});
