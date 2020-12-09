import {expect} from 'chai';
import {LunaMetropolis} from '../../../src/cards/venusNext/LunaMetropolis';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('LunaMetropolis', function() {
  it('Should play', function() {
    const card = new LunaMetropolis();
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player, player], player, gameOptions);

    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
