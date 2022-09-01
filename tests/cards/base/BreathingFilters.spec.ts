import {expect} from 'chai';
import {BreathingFilters} from '../../../src/server/cards/base/BreathingFilters';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('BreathingFilters', function() {
  let card: BreathingFilters;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BreathingFilters();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 7;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
