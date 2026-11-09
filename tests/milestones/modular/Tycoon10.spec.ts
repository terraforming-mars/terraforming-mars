import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Tycoon10} from '@/server/milestones/modular/Tycoon10';
import {fakeCard} from '../../TestingUtils';
import {fakeMarsBot} from '../../automa/FakeMarsBot';
import {TestPlayer} from '../../TestPlayer';

describe('Tycoon10', () => {
  it('Can claim with 10 blue and green cards', () => {
    const milestone = new Tycoon10();
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 9; i++) {
      player.playedCards.push(fakeCard());
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard());
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {cards: 9, expected: false},
    {cards: 10, expected: true},
  ] as const) {
    it('MarsBot needs 10 blue and green cards in its played pile, events aside: ' + JSON.stringify(run), () => {
      const types = [CardType.EVENT, CardType.EVENT, ...Array<CardType>(run.cards).fill(CardType.ACTIVE)];
      const bot = fakeMarsBot({playedProjectCards: types.map((type) => fakeCard({type}))});

      expect(new Tycoon10().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
