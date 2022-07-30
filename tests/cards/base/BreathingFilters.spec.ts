import {expect} from 'chai';
import {BreathingFilters} from '../../../src/cards/base/BreathingFilters';
import {Game} from '../../../src/Game';
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

    card.play();
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
