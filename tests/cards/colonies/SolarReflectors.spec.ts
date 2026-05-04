import {expect} from 'chai';
import {SolarReflectors} from '../../../src/server/cards/colonies/SolarReflectors';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('SolarReflectors', () => {
  it('Should play', () => {
    const card = new SolarReflectors();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(5);
  });
});
