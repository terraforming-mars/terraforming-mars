import {expect} from 'chai';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {MorningStarIncMarsBot} from '@/server/automa/corps/venusNext/MorningStarIncMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('MorningStarIncMarsBot', () => {
  // With Venus Next the bonus deck's Lobbyists is B15. Its silver resource cubes sit on the Venus track (rulebook B p.3)
  it('swaps Lobbyists for Venusian Lobby, and its silver resource cubes pay 5 M€', () => {
    const {marsBot, calls} = recordingMarsBot();

    new MorningStarIncMarsBot().setup(marsBot);
    new MorningStarIncMarsBot().onTrackCubeTrigger(marsBot, 7, 5, 'credit');

    expect(calls).deep.eq(['removeBonusCard(B06)', 'removeBonusCard(B15)', 'addBonusCardToBonusDeck(B26)', 'gainMc(5)']);
    expect(trackCubes(new MorningStarIncMarsBot(), [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]))
      .deep.eq([5, 6, 7, 8, 9, 11, 12].map((position) => `venus credit ${position}`));
  });
});
