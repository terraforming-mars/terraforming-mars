import {expect} from 'chai';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('DustSeals', function() {
  let card : DustSeals; let player : TestPlayer;

  beforeEach(function() {
    card = new DustSeals();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    TestingUtils.maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});

