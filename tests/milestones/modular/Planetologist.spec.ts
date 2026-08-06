import {expect} from 'chai';
import {Planetologist} from '../../../src/server/milestones/modular/Planetologist';
import {TestPlayer} from '../../TestPlayer';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../../src/server/automa/boards/VenusMarsBot';

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

  it('MarsBot claims it with two of power, earth and Venus tracks at space 3', () => {
    const milestone = new Planetologist();
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 3; i++) {
      board.tracks[4].advance();
    }
    for (let i = 0; i < 2; i++) {
      board.tracks[5].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    for (let i = 0; i < 3; i++) {
      board.tracks[7].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
