import {expect} from 'chai';
import {NobelPrize} from '@/server/cards/prelude2/NobelPrize';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NobelPrize', () => {
  let card: NobelPrize;
  let player: TestPlayer;

  beforeEach(() => {
    card = new NobelPrize();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);

    expect(player.megaCredits).to.eq(5);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0].requirements).is.not.empty;
    expect(player.cardsInHand[1].requirements).is.not.empty;
  });
});
