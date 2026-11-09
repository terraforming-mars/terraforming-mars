import {expect} from 'chai';
import {Tactician4} from '@/server/milestones/modular/Tactician4';
import {fakeMarsBot} from '../../automa/FakeMarsBot';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';

describe('Tactician4', () => {
  it('Can claim with 4 cards with requirements', () => {
    const milestone = new Tactician4();
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 3; i++) {
      player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {megacredits: 29, expected: false},
    {megacredits: 30, expected: true},
  ] as const) {
    it('MarsBot needs 30 M€: ' + JSON.stringify(run), () => {
      const bot = fakeMarsBot({megacredits: run.megacredits});

      expect(new Tactician4().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
