import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {LaggingRegulation} from '../../../src/server/cards/underworld/LaggingRegulation';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('LaggingRegulation', () => {
  let card: LaggingRegulation;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new LaggingRegulation();
    [game, player1, player2, player3] = testGame(3, {turmoilExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {
      it: 'first, second, third',
      values: [
        {crimeTags: 2, influence: 0, expected: {corruption: 1, mc: 9}},
        {crimeTags: 1, influence: 0, expected: {corruption: 1, mc: 3}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'first, second, third, with influence',
      values: [
        {crimeTags: 0, influence: 2, expected: {corruption: 1, mc: 9}},
        {crimeTags: 0, influence: 1, expected: {corruption: 1, mc: 3}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'tie for first place',
      values: [
        {crimeTags: 0, influence: 1, expected: {corruption: 1, mc: 9}},
        {crimeTags: 0, influence: 1, expected: {corruption: 1, mc: 9}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'tie for second place',
      values: [
        {crimeTags: 2, influence: 1, expected: {corruption: 1, mc: 9}},
        {crimeTags: 0, influence: 1, expected: {corruption: 1, mc: 3}},
        {crimeTags: 1, influence: 0, expected: {corruption: 1, mc: 3}},
      ],
    },
    {
      it: 'only first',
      values: [
        {crimeTags: 2, influence: 0, expected: {corruption: 1, mc: 9}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'none',
      values: [
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {crimeTags: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
  ] as const;

  for (const run of resolveTests) {
    it(run.it, () => {
      player1.tagsForTest = {crime: run.values[0].crimeTags};
      turmoil.addInfluenceBonus(player1, run.values[0].influence);

      player2.tagsForTest = {crime: run.values[1].crimeTags};
      turmoil.addInfluenceBonus(player2, run.values[1].influence);

      player3.tagsForTest = {crime: run.values[2].crimeTags};
      turmoil.addInfluenceBonus(player3, run.values[2].influence);

      card.resolve(game, turmoil);

      expect(player1.underworldData.corruption).eq(run.values[0].expected.corruption);
      expect(player1.stock.megacredits).eq(run.values[0].expected.mc);

      expect(player2.underworldData.corruption).eq(run.values[1].expected.corruption);
      expect(player2.stock.megacredits).eq(run.values[1].expected.mc);

      expect(player3.underworldData.corruption).eq(run.values[2].expected.corruption);
      expect(player3.stock.megacredits).eq(run.values[2].expected.mc);
    });
  }
});
