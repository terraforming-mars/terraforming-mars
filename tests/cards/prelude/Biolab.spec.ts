import {expect} from 'chai';
import {Biolab} from '../../../src/cards/prelude/Biolab';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Biolab', function() {
  it('Should play', function() {
    const card = new Biolab();
    const player = TestPlayers.BLUE.newPlayer();
    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
