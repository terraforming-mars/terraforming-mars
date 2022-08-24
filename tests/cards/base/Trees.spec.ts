import {expect} from 'chai';
import {Trees} from '../../../src/server/cards/base/Trees';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Trees', function() {
  let card: Trees;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Trees();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -4;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(3);
    expect(player.plants).to.eq(1);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
