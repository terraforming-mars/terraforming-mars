import {expect} from 'chai';
import {TitaniumMine} from '../../../src/cards/base/TitaniumMine';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TitaniumMine', function() {
  it('Should play', function() {
    const card = new TitaniumMine();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
