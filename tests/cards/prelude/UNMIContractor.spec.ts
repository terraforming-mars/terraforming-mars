import {expect} from 'chai';
import {UNMIContractor} from '../../../src/cards/prelude/UNMIContractor';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('UNMIContractor', function() {
  it('Should play', function() {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('bar', [player], player);
    const card = new UNMIContractor();
    card.play(player);

    expect(player.getTerraformRating()).to.eq(17);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
