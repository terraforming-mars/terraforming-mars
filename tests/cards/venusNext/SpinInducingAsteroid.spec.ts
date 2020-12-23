import {expect} from 'chai';
import {MorningStarInc} from '../../../src/cards/venusNext/MorningStarInc';
import {SpinInducingAsteroid} from '../../../src/cards/venusNext/SpinInducingAsteroid';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('SpinInducingAsteroid', function() {
  let card : SpinInducingAsteroid; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SpinInducingAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);
    expect(game.getVenusScaleLevel()).to.eq(4);
  });

  it('Should play with Morning Star', function() {
    player.corporationCard = new MorningStarInc();
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(game.getVenusScaleLevel()).to.eq(16);
  });
});
