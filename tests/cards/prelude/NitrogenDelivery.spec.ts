import {expect} from 'chai';
import {NitrogenDelivery} from '../../../src/cards/prelude/NitrogenDelivery';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('NitrogenDelivery', function() {
  it('Should play', function() {
    const card = new NitrogenDelivery();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.megaCredits).to.eq(5);
  });
});
