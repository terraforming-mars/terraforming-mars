import {expect} from 'chai';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

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
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(1);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
