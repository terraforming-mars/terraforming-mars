import {expect} from 'chai';
import {Excentric} from '@/server/awards/Excentric';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {CardResource} from '@/common/CardResource';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';

describe('Excentric', () => {
  it('scores a player by resources on cards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const card = fakeCard({resourceType: CardResource.MICROBE});
    card.resourceCount = 4;
    player.playedCards.push(card);

    expect(new Excentric().getScore(player)).to.eq(4);
  });

  it('MarsBot counts every 5 M€ as one resource', () => {
    for (const run of [
      {megacredits: 4, expected: 0},
      {megacredits: 5, expected: 1},
      {megacredits: 14, expected: 2},
    ]) {
      const bot = fakeMarsBot({megacredits: run.megacredits});

      expect(new Excentric().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
