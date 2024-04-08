import {expect} from 'chai';
import {RadChemFactory} from '../../../src/server/cards/base/RadChemFactory';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';

describe('RadChemFactory', function() {
  let card: RadChemFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RadChemFactory();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
