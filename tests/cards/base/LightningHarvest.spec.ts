import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/cards/base/LightningHarvest';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LightningHarvest', function() {
  let card : LightningHarvest; let player : TestPlayer;

  beforeEach(function() {
    card = new LightningHarvest();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
