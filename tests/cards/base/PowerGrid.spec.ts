import {expect} from 'chai';
import {PowerGrid} from '../../../src/cards/base/PowerGrid';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('PowerGrid', function() {
  it('Should play', function() {
    const card = new PowerGrid();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
