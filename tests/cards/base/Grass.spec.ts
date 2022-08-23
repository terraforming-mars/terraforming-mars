import {expect} from 'chai';
import {Grass} from '../../../src/server/cards/base/Grass';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Grass', function() {
  let card: Grass;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Grass();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -16;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(3);
  });
});
