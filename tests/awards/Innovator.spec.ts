import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Innovator} from '@/server/awards/Innovator';
import {fakeCard} from '../TestingUtils';
import {CardType} from '@/common/cards/CardType';
import {TestPlayer} from '../TestPlayer';

describe('Innovator', () => {
  let award: Innovator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Innovator();
    [/* game */, player] = testGame(2);
  });

  it('counts green, blue and red (event) cards', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({type: CardType.AUTOMATED}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({type: CardType.ACTIVE}));
    expect(award.getScore(player)).to.eq(2);

    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(3);
  });

  it('does not count corporations, preludes or CEOs', () => {
    player.playedCards.push(fakeCard({type: CardType.AUTOMATED}));
    player.playedCards.push(fakeCard({type: CardType.PRELUDE}));
    player.playedCards.push(fakeCard({type: CardType.CORPORATION}));
    player.playedCards.push(fakeCard({type: CardType.CEO}));
    expect(award.getScore(player)).to.eq(1);
  });
});
