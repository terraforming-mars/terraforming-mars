import {expect} from 'chai';
import {TitaniumMine} from '../../../src/server/cards/base/TitaniumMine';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('TitaniumMine', function() {
  it('Should play', function() {
    const card = new TitaniumMine();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
  });
});
