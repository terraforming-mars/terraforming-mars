import {expect} from 'chai';
import {CryoSleep} from '../../../src/server/cards/colonies/CryoSleep';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestingUtils';
import {cast} from '../../../src/common/utils/utils';

describe('CryoSleep', () => {
  it('Should play', () => {
    const card = new CryoSleep();
    const [/* game */, player/* , player2 */] = testGame(2);
    cast(card.play(player), undefined);
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
