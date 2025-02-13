import {expect} from 'chai';
import {ValuableGases} from '../../../src/server/cards/community/ValuableGases';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('ValuableGases', () => {
  let card: ValuableGases;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ValuableGases();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.megaCredits).to.eq(6);
  });
});
