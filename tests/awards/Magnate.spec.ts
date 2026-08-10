import {expect} from 'chai';
import {Magnate} from '../../src/server/awards/Magnate';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Magnate', () => {
  const award = new Magnate();

  it('scores a player by automated cards', () => {
    const [, player] = testGame(2);
    player.playedCards.push(fakeCard({type: CardType.AUTOMATED}));
    player.playedCards.push(fakeCard({type: CardType.ACTIVE}));
    player.playedCards.push(fakeCard({type: CardType.EVENT}));

    expect(award.getScore(player)).to.eq(1);
  });

  it('scores MarsBot by the automated cards in its own played pile', () => {
    const pile = [fakeCard({type: CardType.AUTOMATED}), fakeCard({type: CardType.AUTOMATED}), fakeCard({type: CardType.EVENT})];
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;

    expect(award.marsBotScore(bot)).to.eq(2);
  });
});
