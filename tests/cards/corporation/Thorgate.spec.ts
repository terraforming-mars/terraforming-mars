import {expect} from 'chai';
import {EnergySaving} from '../../../src/cards/base/EnergySaving';
import {Pets} from '../../../src/cards/base/Pets';
import {Thorgate} from '../../../src/cards/corporation/Thorgate';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';
import {PowerPlantStandard} from '../../../src/cards/standardProjects/PowerPlant';

describe('Thorgate', function() {
  it('Should play', function() {
    const card = new Thorgate();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    player.corporationCard = card;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getCardDiscount(player, game, new EnergySaving())).to.eq(3);
    expect(card.getCardDiscount(player, game, new Pets())).to.eq(0);
    const powerPlant = new PowerPlantStandard();
    player.megaCredits = powerPlant.cost - 3;
    expect(powerPlant.canAct(player, game)).eq(true);
    player.megaCredits--;
    expect(powerPlant.canAct(player, game)).eq(false);
  });
});
