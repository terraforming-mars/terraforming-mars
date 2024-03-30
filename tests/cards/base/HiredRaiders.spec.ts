import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {HiredRaiders} from '../../../src/server/cards/base/HiredRaiders';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('HiredRaiders', function() {
  let card: HiredRaiders;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new HiredRaiders();
    [/* game */, player, player2] = testGame(2);
  });

  it('Should play', function() {
    player.stock.megacredits = 10;
    player2.stock.steel = 2;
    player2.stock.megacredits = 2;

    const action = cast(card.play(player), OrOptions);
    expect(action.options).has.lengthOf(3);
    action.options[1].cb();
    expect(player2.stock.megacredits).to.eq(0);
    expect(player.stock.megacredits).to.eq(12);

    action.options[0].cb();
    expect(player2.stock.steel).to.eq(0);
    expect(player.stock.steel).to.eq(2);
  });

  it('Works in solo', function() {
    [/* game */, player] = testGame(1);

    const action = cast(card.play(player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb();
    expect(player.stock.steel).to.eq(2);

    action.options[1].cb();
    expect(player.stock.megacredits).to.eq(3);
  });
});
