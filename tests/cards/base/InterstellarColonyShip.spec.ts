import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {InterstellarColonyShip} from '../../../src/cards/base/InterstellarColonyShip';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('InterstellarColonyShip', function() {
  let card : InterstellarColonyShip; let player : Player; let game : Game;

  beforeEach(function() {
    card = new InterstellarColonyShip();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research(), new Research(), new GeneRepair());
    expect(card.canPlay(player)).is.true;

    card.play(player, game);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
  });
});
