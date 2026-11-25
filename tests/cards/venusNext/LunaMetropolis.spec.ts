import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/server/cards/venusNext/LunaMetropolis';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('LunaMetropolis', () => {
  it('Should play', () => {
    const card = new LunaMetropolis();
    const [/* game */, player] = testGame(2, {expansions: {venus: true}});

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(1);
  });
});
