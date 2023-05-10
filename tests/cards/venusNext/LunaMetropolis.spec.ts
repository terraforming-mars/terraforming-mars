import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/server/cards/venusNext/LunaMetropolis';
import {testGame} from '../../TestGame';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const [, player] = testGame(2, {venusNextExtension: true});

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
  });
});
