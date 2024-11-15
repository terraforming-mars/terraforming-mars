import {expect} from 'chai';
import {Planetologist} from '../../../src/server/milestones/modular/Planetologist';
import {TestPlayer} from '../../TestPlayer';

describe('Planetologist', () => {
  const canClaimRuns = [
    {earth: 0, jovian: 0, venus: 0, wild: 0, expected: {score: 0, canClaim: false}},
    {earth: 0, jovian: 2, venus: 2, wild: 0, expected: {score: 4, canClaim: false}},
    {earth: 2, jovian: 2, venus: 2, wild: 0, expected: {score: 6, canClaim: true}},
    {earth: 7, jovian: 3, venus: 7, wild: 0, expected: {score: 6, canClaim: true}},
    {earth: 1, jovian: 2, venus: 2, wild: 0, expected: {score: 5, canClaim: false}},
    {earth: 1, jovian: 2, venus: 2, wild: 1, expected: {score: 6, canClaim: true}},
    {earth: 1, jovian: 1, venus: 1, wild: 1, expected: {score: 4, canClaim: false}},
    {earth: 0, jovian: 0, venus: 0, wild: 6, expected: {score: 6, canClaim: true}},
  ] as const;
  for (const run of canClaimRuns) {
    it('canClaim ' + JSON.stringify(run), () => {
      const milestone = new Planetologist();
      const player = TestPlayer.BLUE.newPlayer();
      player.tagsForTest = {earth: run.earth, venus: run.venus, jovian: run.jovian, wild: run.wild};
      expect(milestone.getScore(player)).eq(run.expected.score);
      expect(milestone.canClaim(player)).eq(run.expected.canClaim);
    });
  }
});
