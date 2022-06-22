import {expect} from 'chai';
import {Harvest} from '../../../src/cards/promo/Harvest';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Harvest', function() {
  let card : Harvest; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Harvest();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

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
