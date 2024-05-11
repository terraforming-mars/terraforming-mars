import {expect} from 'chai';
import {EcoLine} from '../../../src/server/cards/corporation/EcoLine';
import {ConvertPlants} from '../../../src/server/cards/base/standardActions/ConvertPlants';
import {cast, testGame} from '../../TestingUtils';

describe('EcoLine', function() {
  it('Should play', function() {
    const card = new EcoLine();
    const [/* game*/, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.plants).to.eq(2);
    expect(player.plants).to.eq(3);
    expect(player.plantsNeededForGreenery).to.eq(7);

    const convert = new ConvertPlants();
    expect(convert.canAct(player)).eq(false);
    player.plants = 7;
    expect(convert.canAct(player)).eq(true);

    const action2 = convert.action(player);
    expect(action2).not.eq(undefined);
    action2.cb(action2.spaces[0]);
    expect(player.plants).to.eq(0);
  });
});
