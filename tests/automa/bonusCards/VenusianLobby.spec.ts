import {expect} from 'chai';
import {GlobalParameter} from '@/common/GlobalParameter';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {VenusianLobby} from '@/server/automa/bonusCards/VenusianLobby';
import {testGame} from '../../TestGame';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('VenusianLobby', () => {
  for (const run of [
    {intercepted: false, expected: 2},
    {intercepted: true, expected: 0},
  ] as const) {
    it('raises Venus unless a corp cancels it, advances the Venus track and raises the furthest parameter: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2, {venusNextExtension: true});
      const marsBotBoard = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      const {marsBot, calls} = recordingMarsBot({
        game, player: botPlayer, humanPlayer: human, megacredits: 0, marsBotBoard,
        interceptsParameterRaise: (parameter) => run.intercepted && parameter === GlobalParameter.VENUS,
      });

      new VenusianLobby().resolve(marsBot);

      expect(game.getVenusScaleLevel()).eq(run.expected);
      expect(calls).deep.eq([
        `maybeAdvanceTrack(${marsBotBoard.tagToTrack[Tag.VENUS]})`,
        `advanceFurthestParameter(${CardName.AUTOMA_VENUSIAN_LOBBY})`,
      ]);
    });
  }

  it('advances the least-advanced track without Venus Next', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
    for (const track of marsBot.marsBotBoard.tracks) {
      track.position = 3;
    }
    marsBot.marsBotBoard.tracks[TRACK.science].position = 1;

    new VenusianLobby().resolve(marsBot);

    expect(calls).deep.eq([`maybeAdvanceTrack(${TRACK.science})`]);
  });
});
