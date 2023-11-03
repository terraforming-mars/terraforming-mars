import {expect} from 'chai';
import {ValuableGases} from '../../../src/server/cards/community/ValuableGases';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('ValuableGases', function() {
  let card: ValuableGases;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ValuableGases();
    [/* game */, player] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(6);
  });
});
