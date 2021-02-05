import {expect} from 'chai';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils, TestPlayers} from '../../TestingUtils';

describe('DustSeals', function() {
  let card : DustSeals; let player : Player;

  beforeEach(function() {
    card = new DustSeals();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    TestingUtils.maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});

