import {expect} from 'chai';
import {Steelworks} from '../../../src/server/cards/base/Steelworks';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Steelworks', function() {
  let card: Steelworks;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Steelworks();
    [game, player] = testGame(2);
  });

  it('Can not act', function() {
    player.stock.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.stock.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.stock.energy).to.eq(0);
    expect(player.stock.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
