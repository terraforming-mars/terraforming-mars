import {expect} from 'chai';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('FoodFactory', () => {
  let card: FoodFactory;
  let player: TestPlayer;

  beforeEach(() => {
    card = new FoodFactory();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(4);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
