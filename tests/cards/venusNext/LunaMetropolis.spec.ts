import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/server/cards/venusNext/LunaMetropolis';
import {testGame} from '../../TestGame';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const [, player] = testGame(2, {venusNextExtension: true});

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(1);
  });
});
