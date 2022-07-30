import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/cards/base/LightningHarvest';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('LightningHarvest', function() {
  let card: LightningHarvest;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LightningHarvest();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
