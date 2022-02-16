import {expect} from 'chai';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '../../src/common/constants';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {MagneticFieldStimulationDelays} from '../../src/turmoil/globalEvents/MagneticFieldStimulationDelays';
import {TestPlayers} from '../TestPlayers';

describe('MagneticFieldStimulationDelays', function() {
  let card: MagneticFieldStimulationDelays;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new MagneticFieldStimulationDelays();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('resolve play', function() {
    (game as any).temperature = -30;
    (game as any).oxygenLevel = 0;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(-30);
    expect(game.getOxygenLevel()).to.eq(0);

    (game as any).temperature = -28;
    (game as any).oxygenLevel = 1;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(-30);
    expect(game.getOxygenLevel()).to.eq(0);

    (game as any).temperature = -26;
    (game as any).oxygenLevel = 2;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(-30);
    expect(game.getOxygenLevel()).to.eq(0);

    (game as any).temperature = -24;
    (game as any).oxygenLevel = 3;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(-28);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('cannot reduce temperature if maxed out', function() {
    (game as any).temperature = MAX_TEMPERATURE;
    (game as any).oxygenLevel = 5;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(MAX_TEMPERATURE);
    expect(game.getOxygenLevel()).to.eq(3);
  });

  it('cannot reduce oxygen if maxed out', function() {
    (game as any).temperature = 0;
    (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;

    card.resolve(game);

    expect(game.getTemperature()).to.eq(-4);
    expect(game.getOxygenLevel()).to.eq(MAX_OXYGEN_LEVEL);
  });
});
