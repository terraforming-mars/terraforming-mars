import {expect} from 'chai';
import {NitrogenShipment} from '../../../src/server/cards/prelude/NitrogenShipment';
import {testGame} from '../../TestGame';

describe('NitrogenShipment', function() {
  it('Should play', function() {
    const card = new NitrogenShipment();
    const [, player] = testGame(2);

    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.production.plants).to.eq(1);
    expect(player.megaCredits).to.eq(5);
  });
});
