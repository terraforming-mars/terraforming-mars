import {expect} from 'chai';
import {EcoLine} from '../../../src/cards/corporation/EcoLine';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {ConvertPlants} from '../../../src/cards/base/standardActions/ConvertPlants';
import {Game} from '../../../src/Game';

describe('EcoLine', function() {
  it('Should play', function() {
    const card = new EcoLine();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.plants).to.eq(3);
    expect(player.plantsNeededForGreenery).to.eq(7);

    const convert = new ConvertPlants();
    expect(convert.canAct(player)).eq(false);
    player.plants = 7;
    expect(convert.canAct(player)).eq(true);

    const action2 = convert.action(player);
    expect(action2).not.eq(undefined);
    action2.cb(action2.availableSpaces[0]);
    expect(player.plants).to.eq(0);
  });
});
