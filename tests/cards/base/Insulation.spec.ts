
import {expect} from 'chai';
import {Insulation} from '../../../src/server/cards/base/Insulation';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Insulation', function() {
  it('Should play', function() {
    const card = new Insulation();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    expect(card.canPlay(player)).is.false;
    player.production.add(Resources.HEAT, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    if (action === undefined) return;
    action.cb(1);
    expect(player.production.heat).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });
});
