import {expect} from 'chai';
import {NitrogenDelivery} from '../../../src/server/cards/prelude/NitrogenDelivery';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('NitrogenDelivery', function() {
  it('Should play', function() {
    const card = new NitrogenDelivery();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.megaCredits).to.eq(5);
  });
});
