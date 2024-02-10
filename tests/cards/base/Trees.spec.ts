import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Trees} from '../../../src/server/cards/base/Trees';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Trees', function() {
  let card: Trees;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Trees();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(3);
    expect(player.plants).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
