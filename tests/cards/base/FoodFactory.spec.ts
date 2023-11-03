import {expect} from 'chai';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('FoodFactory', function() {
  let card: FoodFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FoodFactory();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.PLANTS, 1);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(4);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
