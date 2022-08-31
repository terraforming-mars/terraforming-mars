import {expect} from 'chai';
import {Windmills} from '../../../src/server/cards/base/Windmills';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Windmills', function() {
  let card: Windmills;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Windmills();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player)).is.not.true;
  });
  it('Should play', function() {
    (game as any).oxygenLevel = 7;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
