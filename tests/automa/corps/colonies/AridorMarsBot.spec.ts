import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {MARSBOT_BOARDS} from '@/server/automa/boards/MarsBotBoards';
import {AridorMarsBot} from '@/server/automa/corps/colonies/AridorMarsBot';
import {Titan} from '@/server/colonies/Titan';
import {testGame} from '../../../TestGame';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('AridorMarsBot', () => {
  it('advances the event track when a cube of either color is reached', () => {
    const {marsBot, calls} = recordingMarsBot();

    new AridorMarsBot().onTrackCubeTrigger(marsBot);

    expect(calls).deep.eq([`advanceTrack(${TRACK.event})`]);
  });

  // Each board has the Jovian and city tags on different rows, named here by their first tag
  for (const run of [
    {boardName: BoardName.THARSIS, jovianTrack: 'power', cityTrack: 'earth'},
    {boardName: BoardName.TERRA_CIMMERIA_NOVA, jovianTrack: 'earth', cityTrack: 'science'},
  ] as const) {
    it('puts a white cube on #6 of the Jovian track and a black one on #6 of the city track: ' + JSON.stringify(run), () => {
      expect(trackCubes(new AridorMarsBot(), MARSBOT_BOARDS[run.boardName]!)).to.have.members([
        'building white 3', 'space white 3', 'science white 3', 'power white 3', `${run.jovianTrack} white 6`,
        'earth black 3', `${run.cityTrack} black 6`, 'plant black 3', 'plant black 6',
      ]);
    });
  }

  it('adds a colony tile to the game at setup, active, and builds no colony', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const {marsBot, calls} = recordingMarsBot({game});
    const titan = new Titan();
    game.discardedColonies = [titan];

    new AridorMarsBot().setup(marsBot);

    expect(game.colonies).includes(titan);
    expect(game.discardedColonies).is.empty;
    expect(titan.isActive).is.true;
    expect(calls).is.empty;
  });

  it('adds nothing at setup when every colony tile is already in play', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const {marsBot} = recordingMarsBot({game});
    game.discardedColonies = [];
    const inPlay = game.colonies.slice();

    new AridorMarsBot().setup(marsBot);

    expect(game.colonies).deep.eq(inPlay);
  });
});
