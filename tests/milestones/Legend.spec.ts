import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Legend} from '@/server/milestones/Legend';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';

describe('Legend', () => {
  it('Can claim with 5 played events', () => {
    const milestone = new Legend();
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 4; i++) {
      player.playedCards.push(fakeCard({type: CardType.EVENT}));
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {events: 4, expected: false},
    {events: 5, expected: true},
  ] as const) {
    it('MarsBot needs 5 events in its played pile: ' + JSON.stringify(run), () => {
      const types = [CardType.ACTIVE, CardType.AUTOMATED, ...Array<CardType>(run.events).fill(CardType.EVENT)];
      const bot = fakeMarsBot({playedProjectCards: types.map((type) => fakeCard({type}))});

      expect(new Legend().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
