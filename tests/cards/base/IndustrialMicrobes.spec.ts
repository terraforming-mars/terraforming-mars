import {expect} from 'chai';
import {IndustrialMicrobes} from '../../../src/server/cards/base/IndustrialMicrobes';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('IndustrialMicrobes', function() {
  it('Should play', function() {
    const card = new IndustrialMicrobes();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
