import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Bushes', function() {
  let card: Bushes;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Bushes();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -10;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(2);
    expect(player.plants).to.eq(2);
  });
});
