import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/server/cards/venusNext/LunaMetropolis';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    Game.newInstance('gameid', [player, redPlayer], player, gameOptions);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
  });
});
