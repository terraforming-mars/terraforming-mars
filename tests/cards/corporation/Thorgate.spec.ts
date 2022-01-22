import {expect} from 'chai';
import {EnergySaving} from '../../../src/cards/base/EnergySaving';
import {Pets} from '../../../src/cards/base/Pets';
import {PowerPlantStandardProject} from '../../../src/cards/base/standardProjects/PowerPlantStandardProject';
import {Thorgate} from '../../../src/cards/corporation/Thorgate';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Thorgate', function() {
  it('Should play', function() {
    const card = new Thorgate();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.corporationCard = card;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getCardDiscount(player, new EnergySaving())).to.eq(3);
    expect(card.getCardDiscount(player, new Pets())).to.eq(0);
    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 3;
    expect(powerPlant.canAct(player)).eq(true);
    player.megaCredits--;
    expect(powerPlant.canAct(player)).eq(false);
  });
});
