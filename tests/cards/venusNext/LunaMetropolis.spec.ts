import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/cards/venusNext/LunaMetropolis';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    Game.newInstance('foobar', [player, redPlayer], player, gameOptions);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
