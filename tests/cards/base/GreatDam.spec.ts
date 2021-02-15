import {expect} from 'chai';
import {GreatDam} from '../../../src/cards/base/GreatDam';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils, TestPlayers} from '../../TestingUtils';

describe('GreatDam', function() {
  let card : GreatDam; let player : Player;

  beforeEach(function() {
    card = new GreatDam();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
