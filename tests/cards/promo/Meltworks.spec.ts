import {expect} from 'chai';
import {Meltworks} from '../../../src/server/cards/promo/Meltworks';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Meltworks', function() {
  let card: Meltworks;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Meltworks();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not act', function() {
    player.heat = 4;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.heat = 5;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.steel).to.eq(3);
  });
});
