import {expect} from 'chai';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {Research} from '../../../src/server/cards/base/Research';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('InterstellarColonyShip', function() {
  let card: InterstellarColonyShip;
  let player: TestPlayer;

  beforeEach(function() {
    card = new InterstellarColonyShip();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research(), new Research(), new GeneRepair());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(4);
  });
});
