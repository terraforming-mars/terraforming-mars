import {expect} from 'chai';
import {Celebrity} from '../../src/server/awards/Celebrity';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Celebrity', () => {
  const award = new Celebrity();

  it('scores a player by 20 M€ cards, events aside', () => {
    const [, player] = testGame(2);
    player.playedCards.push(fakeCard({cost: 20}));
    player.playedCards.push(fakeCard({cost: 19}));
    player.playedCards.push(fakeCard({cost: 25, type: CardType.EVENT}));

    expect(award.getScore(player)).to.eq(1);
  });

  it('scores MarsBot by its own played pile, events included', () => {
    const pile = [fakeCard({cost: 20}), fakeCard({cost: 19}), fakeCard({cost: 25, type: CardType.EVENT})];
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;

    expect(award.marsBotScore(bot)).to.eq(2);
  });
});
