import {expect} from 'chai';
import {PowerGrid} from '../../../src/server/cards/base/PowerGrid';
import {EnergySaving} from '../../../src/server/cards/base/EnergySaving';
import {testGame} from '../../TestGame';

describe('PowerGrid', function() {
  it('Should play', function() {
    const card = new PowerGrid();
    const [/* skipped */, player] = testGame(2);
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);

    player.playedCards.push(new EnergySaving()); // Also contains a power tag.
    card.play(player);
    expect(player.production.energy).to.eq(3);
  });
});
