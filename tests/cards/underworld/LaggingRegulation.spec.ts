import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {LaggingRegulation} from '../../../src/server/cards/underworld/LaggingRegulation';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('LaggingRegulation', function() {
  let card: LaggingRegulation;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;
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
        {corruption: 2, influence: 0, expected: {corruption: 3, mc: 3}},
        {corruption: 1, influence: 0, expected: {corruption: 2, mc: 1}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'first, second, third, with influence',
      values: [
        {corruption: 0, influence: 2, expected: {corruption: 1, mc: 3}},
        {corruption: 0, influence: 1, expected: {corruption: 1, mc: 1}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'tie for first place',
      values: [
        {corruption: 0, influence: 1, expected: {corruption: 1, mc: 3}},
        {corruption: 0, influence: 1, expected: {corruption: 1, mc: 3}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'tie for second place',
      values: [
        {corruption: 2, influence: 1, expected: {corruption: 3, mc: 3}},
        {corruption: 0, influence: 1, expected: {corruption: 1, mc: 1}},
        {corruption: 1, influence: 0, expected: {corruption: 2, mc: 1}},
      ],
    },
    {
      it: 'only first',
      values: [
        {corruption: 2, influence: 0, expected: {corruption: 3, mc: 3}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
    {
      it: 'none',
      values: [
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
        {corruption: 0, influence: 0, expected: {corruption: 0, mc: 0}},
      ],
    },
  ] as const;

  for (const run of resolveTests) {
    it(run.it, () => {
      player1.underworldData.corruption = run.values[0].corruption;
      turmoil.addInfluenceBonus(player1, run.values[0].influence);

      player2.underworldData.corruption = run.values[1].corruption;
      turmoil.addInfluenceBonus(player2, run.values[1].influence);

      player3.underworldData.corruption = run.values[2].corruption;
      turmoil.addInfluenceBonus(player3, run.values[2].influence);

      card.resolve(game, turmoil);

      expect(player1.underworldData.corruption).eq(run.values[0].expected.corruption);
      expect(player1.production.megacredits).eq(run.values[0].expected.mc);

      expect(player2.underworldData.corruption).eq(run.values[1].expected.corruption);
      expect(player2.production.megacredits).eq(run.values[1].expected.mc);

      expect(player3.underworldData.corruption).eq(run.values[2].expected.corruption);
      expect(player3.production.megacredits).eq(run.values[2].expected.mc);
    });
  }
});
