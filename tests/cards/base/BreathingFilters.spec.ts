import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {BreathingFilters} from '../../../src/server/cards/base/BreathingFilters';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('BreathingFilters', function() {
  let card: BreathingFilters;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BreathingFilters();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 7);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
