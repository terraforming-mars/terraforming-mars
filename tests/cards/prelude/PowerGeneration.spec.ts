import {expect} from 'chai';
import {PowerGeneration} from '../../../src/server/cards/prelude/PowerGeneration';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('PowerGeneration', () => {
  it('Should play', () => {
    const card = new PowerGeneration();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(3);
  });
});
