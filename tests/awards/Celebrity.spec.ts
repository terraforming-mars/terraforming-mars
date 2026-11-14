import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Celebrity} from '@/server/awards/Celebrity';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {testGame} from '../TestGame';

describe('Celebrity', () => {
  it('scores a player by 20 M€ cards, events aside', () => {
    const [, player] = testGame(2);
    player.playedCards.push(fakeCard({cost: 20}));
    player.playedCards.push(fakeCard({cost: 19}));
    player.playedCards.push(fakeCard({cost: 25, type: CardType.EVENT}));

    expect(new Celebrity().getScore(player)).to.eq(1);
  });

  it('MarsBot counts the cards costing 20 M€ or more in its played pile, events included', () => {
    const playedProjectCards = [
      fakeCard({cost: 20, type: CardType.EVENT}),
      fakeCard({cost: 25, type: CardType.ACTIVE}),
      fakeCard({cost: 19, type: CardType.AUTOMATED}),
    ];
    const marsBot = fakeMarsBot({playedProjectCards});

    expect(new Celebrity().marsBotScore(marsBot)).eq(2);
  });
});
