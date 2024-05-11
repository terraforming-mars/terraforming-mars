import {expect} from 'chai';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {SpinoffDepartment} from '../../../src/server/cards/colonies/SpinoffDepartment';
import {cast, testGame} from '../../TestingUtils';

describe('SpinoffDepartment', function() {
  it('Should play', function() {
    const card = new SpinoffDepartment();
    const card2 = new EarthCatapult();
    const [/* game */, player/* , player2 */] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
    card.onCardPlayed(player, card2);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
