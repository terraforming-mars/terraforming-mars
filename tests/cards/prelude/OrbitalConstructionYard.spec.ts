import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {OrbitalConstructionYard} from '../../../src/server/cards/prelude/OrbitalConstructionYard';
import {cast} from '@/common/utils/utils';

describe('OrbitalConstructionYard', () => {
  it('Should play', () => {
    const card = new OrbitalConstructionYard();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
