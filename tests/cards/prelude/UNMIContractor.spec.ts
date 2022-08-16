import {expect} from 'chai';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('UNMIContractor', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const card = new UNMIContractor();
    card.play(player);

    expect(player.getTerraformRating()).to.eq(17);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
