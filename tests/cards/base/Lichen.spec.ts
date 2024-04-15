import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Lichen', function() {
  let card: Lichen;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Lichen();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -24);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
