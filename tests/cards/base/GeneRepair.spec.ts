import {expect} from 'chai';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

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

    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
