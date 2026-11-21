import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Incorporator} from '../../../src/server/awards/modular/Incorporator';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

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

  it('MarsBot counts the cards costing 10 M€ or less in its played pile, events included', () => {
    const playedProjectCards = [
      fakeCard({cost: 9, type: CardType.EVENT}),
      fakeCard({cost: 10, type: CardType.ACTIVE}),
      fakeCard({cost: 11, type: CardType.AUTOMATED}),
    ];
    const marsBot = fakeMarsBot({playedProjectCards});

    expect(new Incorporator().marsBotScore(marsBot)).eq(2);
  });
});
