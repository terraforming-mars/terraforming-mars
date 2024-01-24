import {expect} from 'chai';
import {Harvest} from '../../../src/server/cards/promo/Harvest';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Harvest', function() {
  let card: Harvest;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Harvest();
    [game, player] = testGame(2);

    const landSpaces = game.board.getAvailableSpacesOnLand(player).slice(0, 2);
    landSpaces.forEach((space) => game.addGreenery(player, space));
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.megaCredits).to.eq(12);
  });
});
