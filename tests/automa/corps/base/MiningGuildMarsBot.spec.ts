import {expect} from 'chai';
import {Phase} from '@/common/Phase';
import {MINING_GUILD_MARSBOT_CORP} from '@/server/automa/corps/base/MiningGuildMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

// Track index on the Tharsis board
const BUILDING = 0;

describe('MiningGuildMarsBot', () => {
  const effect = MINING_GUILD_MARSBOT_CORP.effect!;

  // The M€ MarsBot earns comes off the card, and MarsBot keeps it
  for (const run of [
    {gain: 5, card: 5, advances: 0},
    {mcOnCard: 2, gain: 5, card: 7, advances: 1},
    {mcOnCard: 2, gain: 25, card: 7, advances: 3},
    {mcOnCard: 2, building: 17, gain: 15, card: 10, advances: 1},
  ]) {
    it('counts down from 10, and advances the building track each time the card empties: ' + JSON.stringify(run), () => {
      const {marsBot, calls, corpState} = recordingMarsBot();
      MINING_GUILD_MARSBOT_CORP.setup!(marsBot);
      if (run.mcOnCard !== undefined) {
        corpState.set('mcOnCard', run.mcOnCard);
      }
      marsBot.marsBotBoard.tracks[BUILDING].position = run.building ?? 3;

      effect.onMcGained!(marsBot, run.gain);

      expect(corpState.get('mcOnCard')).eq(run.card);
      expect(calls).deep.eq(Array(run.advances).fill(`advanceTrack(${BUILDING})`));
    });
  }

  it('refills the card before the advance, so the M€ the advance earns comes off the new card', () => {
    const {marsBot, corpState} = recordingMarsBot({advanceTrack: () => effect.onMcGained!(marsBot, 2)});
    corpState.set('mcOnCard', 1);

    effect.onMcGained!(marsBot, 1);

    expect(corpState.get('mcOnCard')).eq(8);
  });

  // Like Philares (BGG 3513998), nothing advances after the game has ended
  it('stops counting down once the game has ended', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    marsBot.game.phase = Phase.END;
    corpState.set('mcOnCard', 2);

    effect.onMcGained!(marsBot, 5);

    expect(corpState.get('mcOnCard')).eq(2);
    expect(calls).is.empty;
  });
});
