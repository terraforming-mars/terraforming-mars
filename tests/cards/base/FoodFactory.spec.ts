import {expect} from 'chai';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('FoodFactory', function() {
  let card: FoodFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FoodFactory();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.PLANTS, 1);
    expect(player.simpleCanPlay(card)).is.true;

    player.simplePlay(card);
    expect(player.production.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(4);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
