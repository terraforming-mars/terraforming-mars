import {expect} from 'chai';
import {Harvest} from '../../../src/server/cards/promo/Harvest';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Harvest', function() {
  let card: Harvest;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Harvest();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);

    const landSpaces = game.board.getAvailableSpacesOnLand(player).slice(0, 2);
    landSpaces.forEach((space) => game.addGreenery(player, space.id));
  });

  it('Cannot play', function() {
    expect(player.canPlayIgnoringCost(card)).is.false;
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.megaCredits).to.eq(12);
  });
});
