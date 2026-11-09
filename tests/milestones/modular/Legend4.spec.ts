import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Legend4} from '@/server/milestones/modular/Legend4';
import {fakeCard} from '../../TestingUtils';
import {fakeMarsBot} from '../../automa/FakeMarsBot';
import {TestPlayer} from '../../TestPlayer';

describe('Legend4', () => {
  it('Can claim with 4 played events', () => {
    const milestone = new Legend4();
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 3; i++) {
      player.playedCards.push(fakeCard({type: CardType.EVENT}));
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {events: 3, expected: false},
    {events: 4, expected: true},
  ] as const) {
    it(`MarsBot needs 4 events in its played pile, ${JSON.stringify(run)}`, () => {
      const types = [CardType.ACTIVE, CardType.AUTOMATED, ...Array<CardType>(run.events).fill(CardType.EVENT)];
      const bot = fakeMarsBot({playedProjectCards: types.map((type) => fakeCard({type}))});

      expect(new Legend4().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
