import {expect} from 'chai';
import {UnitedNationsMarsInitiativeMarsBot} from '@/server/automa/corps/base/UnitedNationsMarsInitiativeMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('UnitedNationsMarsInitiativeMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('returns the setup bonus card and adds Government Subsidy to the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new UnitedNationsMarsInitiativeMarsBot().setup(marsBot);

    expect(calls).deep.eq(['returnSetupBonusCardToBonusDeck()', 'addBonusCardToBonusDeck(B31)']);
  });

  // The start of a generation (rulebook B p.3)
  for (const run of [
    {generation: 1, expected: []},
    {generation: 2, expected: ['maybeMoveBonusCardToActionDeck()']},
  ]) {
    it(`moves a bonus card to the action deck before the action phase from generation 2, generation ${run.generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;

      new UnitedNationsMarsInitiativeMarsBot().beforeActionPhase(marsBot);

      expect(calls).deep.eq(run.expected);
    });
  }
});
