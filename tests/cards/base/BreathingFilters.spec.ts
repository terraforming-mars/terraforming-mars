import {expect} from 'chai';
import {BreathingFilters} from '../../../src/cards/base/BreathingFilters';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('BreathingFilters', function() {
  let card : BreathingFilters; let player : Player; let game : Game;

  beforeEach(function() {
    card = new BreathingFilters();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 7;
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
