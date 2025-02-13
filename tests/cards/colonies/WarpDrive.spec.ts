import {expect} from 'chai';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {WarpDrive} from '../../../src/server/cards/colonies/WarpDrive';
import {cast, testGame} from '../../TestingUtils';

describe('WarpDrive', () => {
  it('Should play', () => {
    const card = new WarpDrive();
    const [/* game */, player/* , player2 */] = testGame(2);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(4);
  });
});

