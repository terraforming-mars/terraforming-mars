import {expect} from 'chai';
import {MARSBOT_BOARD_NAMES} from '../../src/common/automa/MarsBotBoards';
import {awardManifest} from '../../src/server/awards/Awards';
import {milestoneManifest} from '../../src/server/milestones/Milestones';

describe('automaDescription', () => {
  it('every milestone and award MarsBot plays against has one', () => {
    const milestones = new Set([
      ...MARSBOT_BOARD_NAMES.flatMap((board) => milestoneManifest.boards[board]),
      ...milestoneManifest.expansions.venus,
    ]);
    const awards = new Set([
      ...MARSBOT_BOARD_NAMES.flatMap((board) => awardManifest.boards[board]),
      ...awardManifest.expansions.venus,
    ]);
    for (const name of milestones) {
      expect(milestoneManifest.createOrThrow(name).automaDescription, name).is.a('string');
    }
    for (const name of awards) {
      expect(awardManifest.createOrThrow(name).automaDescription, name).is.a('string');
    }
  });
});
