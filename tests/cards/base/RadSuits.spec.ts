import {expect} from 'chai';
import {RadSuits} from '../../../src/server/cards/base/RadSuits';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('RadSuits', function() {
  let card: RadSuits;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RadSuits();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCity(player, lands[0]);
    game.addCity(player, lands[1]);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.megacredits).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
