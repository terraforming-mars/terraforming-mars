import {expect} from 'chai';
import {NitrogenShipment} from '../../../src/server/cards/prelude/NitrogenShipment';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('NitrogenShipment', function() {
  it('Should play', function() {
    const card = new NitrogenShipment();
    const [/* game */, player] = testGame(2);

    const action = card.play(player);

    cast(action, undefined);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.production.plants).to.eq(1);
    expect(player.megaCredits).to.eq(5);
  });
});
