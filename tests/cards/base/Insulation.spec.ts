
import {expect} from 'chai';
import {Insulation} from '../../../src/cards/base/Insulation';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Insulation', function() {
  it('Should play', function() {
    const card = new Insulation();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);

    expect(card.canPlay(player)).is.false;
    player.addProduction(Resources.HEAT, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    if (action === undefined) return;
    action.cb(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
