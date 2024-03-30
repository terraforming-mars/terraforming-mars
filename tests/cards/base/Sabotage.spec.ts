import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Sabotage} from '../../../src/server/cards/base/Sabotage';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('Sabotage', function() {
  let card: Sabotage;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new Sabotage();
    [/* game */, player, player2] = testGame(2);
  });

  it('Should play', function() {
    player2.stock.titanium = 3;
    player2.stock.steel = 4;
    player2.stock.megacredits = 7;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(4);

    action.options[0].cb();
    expect(player2.stock.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.stock.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.stock.megacredits).to.eq(0);
  });
});
