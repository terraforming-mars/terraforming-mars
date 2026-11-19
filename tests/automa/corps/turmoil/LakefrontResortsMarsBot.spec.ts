import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {LakefrontResortsMarsBot} from '@/server/automa/corps/turmoil/LakefrontResortsMarsBot';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {testGame} from '../../../TestGame';
import {TRACK, RecordingMarsBot, recordingMarsBot} from '../RecordingMarsBot';


/** A recording bot whose player is MarsBot's player in an automa game. */
function lakefrontBot(fields: Partial<IMarsBot> = {}): RecordingMarsBot {
  const [game] = testGame(1, {automa: true});
  return recordingMarsBot({game, player: game.marsBotPlayer, megacredits: 0, ...fields});
}

describe('LakefrontResortsMarsBot', () => {
  const corp = new LakefrontResortsMarsBot();

  it('setup puts a white cube on the card and pays 3 M€ per adjacent ocean', () => {
    const {marsBot, corpState} = lakefrontBot();

    new LakefrontResortsMarsBot().setup(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(marsBot.player.oceanBonus).eq(3);
  });

  it('oceans alternate between taking the cube off to advance the building track and putting it back', () => {
    const {marsBot, calls, corpState} = lakefrontBot();
    corpState.set('whiteCubeOnCard', 1);

    corp.onTilePlaced(marsBot, false, TileType.OCEAN);
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${TRACK.building})`]);

    corp.onTilePlaced(marsBot, false, TileType.GREENERY);
    expect(corpState.get('whiteCubeOnCard')).eq(0);

    corp.onTilePlaced(marsBot, true, TileType.OCEAN);
    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(calls).deep.eq([`advanceTrack(${TRACK.building})`]);
  });

  // FAQ (rulebook B p.4): Lakefront overrides Government Intervention's "no M€"
  it('keeps the M€ its building track advance earns during Government Intervention', () => {
    const {marsBot, corpState} = lakefrontBot({
      advanceTrack: () => {
        marsBot.megacredits += 4;
      },
    });
    corpState.set('whiteCubeOnCard', 1);
    marsBot.mcKeptThroughIntervention = 0;

    corp.onTilePlaced(marsBot, false, TileType.OCEAN);

    expect(marsBot.mcKeptThroughIntervention).eq(4);
  });
});
