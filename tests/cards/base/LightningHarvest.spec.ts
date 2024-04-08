import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {TestPlayer} from '../../TestPlayer';

describe('LightningHarvest', function() {
  let card: LightningHarvest;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LightningHarvest();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
