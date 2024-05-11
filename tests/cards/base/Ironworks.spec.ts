import {expect} from 'chai';
import {Ironworks} from '../../../src/server/cards/base/Ironworks';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Ironworks', function() {
  let card: Ironworks;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Ironworks();
    [game, player] = testGame(2);
  });

  it('Can not act without enough energy', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.steel).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
