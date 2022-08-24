import {expect} from 'chai';
import {EnergySaving} from '../../../src/server/cards/base/EnergySaving';
import {Pets} from '../../../src/server/cards/base/Pets';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {Thorgate} from '../../../src/server/cards/corporation/Thorgate';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Thorgate', function() {
  it('Should play', function() {
    const card = new Thorgate();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    player.setCorporationForTest(card);
    expect(player.production.energy).to.eq(1);
    expect(card.getCardDiscount(player, new EnergySaving())).to.eq(3);
    expect(card.getCardDiscount(player, new Pets())).to.eq(0);
    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 3;
    expect(powerPlant.canAct(player)).eq(true);
    player.megaCredits--;
    expect(powerPlant.canAct(player)).eq(false);
  });
});
