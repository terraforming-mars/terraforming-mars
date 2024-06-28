import {expect} from 'chai';
import {setVenusScaleLevel} from '../../TestingUtils';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {SpinInducingAsteroid} from '../../../src/server/cards/venusNext/SpinInducingAsteroid';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SpinInducingAsteroid', function() {
  let card: SpinInducingAsteroid;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new SpinInducingAsteroid();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
  });

  it('Should play with Morning Star', function() {
    player.corporations.push(new MorningStarInc());
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(16);
  });
});
