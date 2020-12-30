import {expect} from 'chai';
import {NitrogenDelivery} from '../../../src/cards/prelude/NitrogenDelivery';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('NitrogenDelivery', function() {
  it('Should play', function() {
    const card = new NitrogenDelivery();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.megaCredits).to.eq(5);
  });
});
