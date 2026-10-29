import {expect} from 'chai';
import {MARSBOT_BOARD_NAMES} from '../../src/common/automa/MarsBotBoards';
import {marsBotAwardRule, marsBotMapSet, marsBotMilestoneRule} from '../../src/common/automa/MarsBotMADescriptions';
import {BoardName} from '../../src/common/boards/BoardName';
import {awardManifest} from '../../src/server/awards/Awards';
import {milestoneManifest} from '../../src/server/milestones/Milestones';

describe('MarsBotMADescriptions', () => {
  it('describes every milestone and award MarsBot plays against', () => {
    for (const board of MARSBOT_BOARD_NAMES) {
      for (const name of milestoneManifest.boards[board]) {
        expect(marsBotMilestoneRule(name, board), `${board} ${name}`).is.a('string');
      }
      for (const name of awardManifest.boards[board]) {
        expect(marsBotAwardRule(name, board), `${board} ${name}`).is.a('string');
      }
    }
  });

  it('a map set uses its own wording, the modular wording is the default', () => {
    expect(marsBotMilestoneRule('Rim Settler', BoardName.HELLAS)).to.eq('Science/Jovian track ≥ 6');
    expect(marsBotMilestoneRule('Rim Settler')).to.eq('Energy track ≥ 5');
    expect(marsBotMilestoneRule('Agronomist', BoardName.VASTITAS_BOREALIS_NOVA)).to.eq('Plant/Animal track ≥ 4');
    expect(marsBotMilestoneRule('Agronomist')).to.eq('Bio track ≥ 4');
    expect(marsBotAwardRule('Traveller', BoardName.VASTITAS_BOREALIS_NOVA)).to.eq('Earth/Jovian track + 5');
  });

  it('the map set applies unless the Milestones & Awards expansion is on', () => {
    const options = {boardName: BoardName.HELLAS, modularMA: false};
    expect(marsBotMapSet(options)).to.eq(BoardName.HELLAS);
    expect(marsBotMapSet({...options, modularMA: true})).is.undefined;
  });
});
