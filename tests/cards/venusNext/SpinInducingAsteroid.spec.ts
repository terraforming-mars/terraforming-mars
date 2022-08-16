import {expect} from 'chai';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {SpinInducingAsteroid} from '../../../src/server/cards/venusNext/SpinInducingAsteroid';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpinInducingAsteroid', function() {
  let card: SpinInducingAsteroid;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SpinInducingAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
  });

  it('Should play with Morning Star', function() {
    player.setCorporationForTest(new MorningStarInc());
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(16);
  });
});
