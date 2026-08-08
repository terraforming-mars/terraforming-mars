import {expect} from 'chai';
import {PublicPlans} from '@/server/cards/promo/PublicPlans';
import {Research} from '@/server/cards/base/Research';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {SelectCard} from '@/server/inputs/SelectCard';
import {ICard} from '@/server/cards/ICard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('PublicPlans', () => {
  let card: PublicPlans;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PublicPlans();
    [/* game */, player] = testGame(2);
  });

  it('play with an empty hand', () => {
    expect(card.play(player)).is.undefined;
    expect(player.megaCredits).to.eq(0);
  });

  it('play with cards in hand', () => {
    const research = new Research();
    const tardigrades = new Tardigrades();
    player.cardsInHand.push(research, tardigrades);

    const selectCard = cast(card.play(player), SelectCard<ICard>);
    expect(selectCard.cards).deep.eq(player.cardsInHand);
    expect(selectCard.config.min).to.eq(0);
    expect(selectCard.config.max).to.eq(2);
    expect(selectCard.config.showSelectAll).is.true;
  });

  it('selecting 0 cards grants 0 M€', () => {
    const research = new Research();
    player.cardsInHand.push(research);

    const selectCard = cast(card.play(player), SelectCard<ICard>);
    selectCard.cb([]);

    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).deep.eq([research]);
  });

  it('selecting some cards grants 1 M€ each, and the cards remain in hand', () => {
    const research = new Research();
    const tardigrades = new Tardigrades();
    player.cardsInHand.push(research, tardigrades);

    const selectCard = cast(card.play(player), SelectCard<ICard>);
    selectCard.cb([research, tardigrades]);

    expect(player.megaCredits).to.eq(2);
    expect(player.cardsInHand).deep.eq([research, tardigrades]);
  });
});
