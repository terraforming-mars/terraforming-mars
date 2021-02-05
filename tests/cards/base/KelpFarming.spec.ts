import {expect} from 'chai';
import {KelpFarming} from '../../../src/cards/base/KelpFarming';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils, TestPlayers} from '../../TestingUtils';

describe('KelpFarming', function() {
  let card : KelpFarming; let player : Player;

  beforeEach(function() {
    card = new KelpFarming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 6);
    expect(card.canPlay(player)).is.true;

    const plantsCount = player.plants;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(3);
    expect(player.plants).to.eq(plantsCount + 2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
