import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Magnate} from '@/server/awards/Magnate';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {testGame} from '../TestGame';

describe('Magnate', () => {
  it('scores a player by automated cards', () => {
    const [, player] = testGame(2);
    player.playedCards.push(fakeCard({type: CardType.AUTOMATED}));
    player.playedCards.push(fakeCard({type: CardType.ACTIVE}));
    player.playedCards.push(fakeCard({type: CardType.EVENT}));

    expect(new Magnate().getScore(player)).to.eq(1);
  });

  it('MarsBot counts the green cards in its played pile', () => {
    const types = [CardType.EVENT, CardType.AUTOMATED, CardType.ACTIVE, CardType.AUTOMATED];
    const bot = fakeMarsBot({playedProjectCards: types.map((type) => fakeCard({type}))});

    expect(new Magnate().marsBotScore(bot)).eq(2);
  });
});
