import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Tycoon} from '@/server/milestones/Tycoon';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';

describe('Tycoon', () => {
  it('Can claim with 15 project cards, events aside', () => {
    const milestone = new Tycoon();
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 14; i++) {
      player.playedCards.push(fakeCard());
    }
    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard());
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot needs 15 blue and green cards in its played pile, events aside', () => {
    for (const run of [
      {cards: 14, expected: false},
      {cards: 15, expected: true},
    ]) {
      const types = [CardType.EVENT, CardType.EVENT, ...Array<CardType>(run.cards).fill(CardType.ACTIVE)];
      const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

      expect(new Tycoon().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
