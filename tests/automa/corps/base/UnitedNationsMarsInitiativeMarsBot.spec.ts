import {expect} from 'chai';
import {UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP} from '@/server/automa/corps/base/UnitedNationsMarsInitiativeMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('UnitedNationsMarsInitiativeMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('returns the setup bonus card and adds Government Subsidy to the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['returnSetupBonusCardToBonusDeck()', 'addBonusCardToBonusDeck(B31)']);
  });

  // The start of a generation (rulebook B p.3)
  for (const run of [
    {generation: 1, calls: []},
    {generation: 2, calls: ['maybeMoveBonusCardToActionDeck()']},
  ]) {
    it(`moves a bonus card to the action deck before the action phase from generation 2, generation ${run.generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;

      UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP.beforeActionPhase!(marsBot);

      expect(calls).deep.eq(run.calls);
    });
  }
});
