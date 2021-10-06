import {expect} from 'chai';
import {KelpFarming} from '../../../src/cards/base/KelpFarming';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('KelpFarming', function() {
  let card : KelpFarming; let player : TestPlayer;

  beforeEach(function() {
    card = new KelpFarming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 6);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const plantsCount = player.plants;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(3);
    expect(player.plants).to.eq(plantsCount + 2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
