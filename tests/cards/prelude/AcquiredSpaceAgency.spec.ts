import {expect} from 'chai';
import {AcquiredSpaceAgency} from '../../../src/server/cards/prelude/AcquiredSpaceAgency';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestingUtils';

describe('AcquiredSpaceAgency', () => {
  it('Should play', () => {
    const card = new AcquiredSpaceAgency();
    const [/* game*/, player] = testGame(1);
    card.play(player);

    expect(player.titanium).to.eq(6);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.SPACE))).has.lengthOf(2);
  });
});
