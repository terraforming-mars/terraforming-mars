import {expect} from 'chai';
import {Forecaster} from '@/server/awards/Forecaster';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';

describe('Forecaster', () => {
  it('scores a player by cards with requirements', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard());

    expect(new Forecaster().getScore(player)).to.eq(1);
  });

  for (const run of [
    {megacredits: 6, expected: 0},
    {megacredits: 7, expected: 1},
    {megacredits: 20, expected: 2},
  ] as const) {
    it('MarsBot counts every 7 M€ as one card with a requirement: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot({megacredits: run.megacredits});

      expect(new Forecaster().marsBotScore(marsBot)).eq(run.expected);
    });
  }
});
