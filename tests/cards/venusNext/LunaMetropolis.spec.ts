import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/server/cards/venusNext/LunaMetropolis';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {setCustomGameOptions} from '../../TestingUtils';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const game = newTestGame(2, setCustomGameOptions());
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
  });
});
