import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Suburbian} from '../../../src/server/awards/modular/Suburbian';
import {addGreenery} from '../../TestingUtils';

describe('Suburbian', () => {
  it('Counts the player\'s tiles on the edges of the map', () => {
    const award = new Suburbian();
    const [/* game */, player, player2] = testGame(2);

    expect(award.getScore(player)).to.eq(0);

    // An edge space (top row).
    addGreenery(player, '03');
    expect(award.getScore(player)).to.eq(1);

    // Not an edge space.
    addGreenery(player, '10');
    expect(award.getScore(player)).to.eq(1);

    // An edge space on the right side.
    addGreenery(player, '13');
    expect(award.getScore(player)).to.eq(2);

    // Another player's tile on an edge space.
    addGreenery(player2, '07');
    expect(award.getScore(player)).to.eq(2);
    expect(award.getScore(player2)).to.eq(1);
  });
});
