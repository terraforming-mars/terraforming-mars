import {expect} from 'chai';
import {Midas} from '../../../src/server/cards/community/Midas';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Midas', () => {
  let card: Midas;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Midas();
    [/* game */, player] = testGame(1);
  });

  it('Starts with correct TR', () => {
    const initialTR = player.terraformRating;

    card.play(player);
    player.playedCards.push(card);
    expect(player.terraformRating).to.eq(initialTR - 7);
  });
});
