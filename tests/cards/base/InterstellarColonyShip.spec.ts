import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {InterstellarColonyShip} from '../../../src/cards/base/InterstellarColonyShip';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
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

    card.play();
    expect(card.getVictoryPoints()).to.eq(4);
  });
});
