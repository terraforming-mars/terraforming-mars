import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Incorporator} from '../../../src/server/awards/modular/Incorporator';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';

describe('Incorporator', () => {
  const getScoreRuns = [
    {cost: 9, type: CardType.AUTOMATED, expected: 1},
    {cost: 10, type: CardType.AUTOMATED, expected: 1},
    {cost: 11, type: CardType.AUTOMATED, expected: 0},
    {cost: 9, type: CardType.CORPORATION, expected: 0},
    {cost: 9, type: CardType.PRELUDE, expected: 0},
    {cost: 9, type: CardType.CEO, expected: 0},
  ] as const;
  for (const run of getScoreRuns) {
    it('getScore ' + JSON.stringify(run), () => {
      const award = new Incorporator();
      const [/* game */, player] = testGame(2);
      player.playedCards.push(fakeCard({cost: run.cost, type: run.type}));
      expect(award.getScore(player)).eq(run.expected);
    });
  }

  it('MarsBot counts its own played pile, events included', () => {
    const award = new Incorporator();
    const pile = [fakeCard({cost: 9, type: CardType.EVENT}), fakeCard({cost: 11, type: CardType.AUTOMATED})];
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;

    expect(award.marsBotScore(bot)).to.eq(1);
  });
});
