import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {Windmills} from '../../../src/server/cards/base/Windmills';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Windmills', function() {
  let card: Windmills;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Windmills();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.not.true;
  });
  it('Should play', function() {
    setOxygenLevel(game, 7);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
