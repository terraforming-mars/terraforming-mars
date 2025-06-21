import {expect} from 'chai';
import {ClassActionLawsuit} from '../../../src/server/cards/underworld/ClassActionLawsuit';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('ClassActionLawsuit', () => {
  const canPlayRuns = [
    {corruption: [0, 0, 0, 0], expected: false, warning: false},
    {corruption: [0, 0, 0, 1], expected: true, warning: false},
    {corruption: [1, 0, 0, 1], expected: false, warning: false},
    {corruption: [1, 0, 0, 0], expected: true, warning: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new ClassActionLawsuit();
      const [/* game */, player, player1, player2, player3] = testGame(4);
      player.underworldData.corruption = run.corruption[0];
      player1.underworldData.corruption = run.corruption[1];
      player2.underworldData.corruption = run.corruption[2];
      player3.underworldData.corruption = run.corruption[3];

      expect(card.canPlay(player)).eq(run.expected);
      expect(card.warnings.size).eq(run.warning ? 1 : 0);
    });
  }
  const playRuns = [
    {corruption: [0, 0, 0, 1], target: 3, diff: 1},
    {corruption: [1, 0, 0, 0], target: 0, diff: 1},
    {corruption: [1, 2, 2, 5], target: 3, diff: 3},
  ] as const;
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), () => {
      const card = new ClassActionLawsuit();
      const [game, player, player1, player2, player3] = testGame(4);
      player.underworldData.corruption = run.corruption[0];
      player1.underworldData.corruption = run.corruption[1];
      player2.underworldData.corruption = run.corruption[2];
      player3.underworldData.corruption = run.corruption[3];

      player.megaCredits = 100;
      player1.megaCredits = 100;
      player2.megaCredits = 100;
      player3.megaCredits = 100;

      player.playCard(card);
      runAllActions(game);

      const target = game.getPlayers()[run.target];
      const startCorruption = run.corruption[run.target];
      const endCorruption = startCorruption - run.diff;

      expect(target.underworldData.corruption).eq(endCorruption);
      expect(target.megaCredits).eq(100 - (run.diff * 3));
    });
  }
});
