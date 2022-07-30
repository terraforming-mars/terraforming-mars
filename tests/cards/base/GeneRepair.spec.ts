import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('GeneRepair', function() {
  let card: GeneRepair;
  let player: TestPlayer;

  beforeEach(function() {
    card = new GeneRepair();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
