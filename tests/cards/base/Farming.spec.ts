import {expect} from 'chai';
import {Farming} from '../../../src/server/cards/base/Farming';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Farming', function() {
  let card: Farming;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Farming();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(player.production.plants).to.eq(2);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(2);
  });
});
