import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {LAKEFRONT_RESORTS_MARSBOT_CORP} from '@/server/automa/corps/turmoil/LakefrontResortsMarsBot';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {testGame} from '../../../TestGame';
import {RecordingMarsBot, recordingMarsBot} from '../RecordingMarsBot';

// Track index on the Tharsis board
const BUILDING = 0;

/** A recording bot whose player is MarsBot's player in an automa game. */
function lakefrontBot(fields: Partial<IMarsBot> = {}): RecordingMarsBot {
  const [game] = testGame(1, {automa: true});
  return recordingMarsBot({game, player: game.marsBotPlayer, megacredits: 0, ...fields});
}

// C35
describe('LakefrontResortsMarsBot', () => {
  const effect = LAKEFRONT_RESORTS_MARSBOT_CORP.effect!;

  it('setup puts a white cube on the card and pays 3 M€ per adjacent ocean', () => {
    const {marsBot, corpState} = lakefrontBot();

    LAKEFRONT_RESORTS_MARSBOT_CORP.setup!(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(marsBot.player.oceanBonus).eq(3);
  });

  it('oceans alternate between taking the cube off to advance the building track and putting it back', () => {
    const {marsBot, calls, corpState} = lakefrontBot();
    const space = marsBot.game.board.spaces[0];
    corpState.set('whiteCubeOnCard', 1);

    effect.onTilePlaced!(marsBot, false, TileType.OCEAN, space);
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${BUILDING})`]);

    effect.onTilePlaced!(marsBot, false, TileType.GREENERY, space);
    expect(corpState.get('whiteCubeOnCard')).eq(0);

    effect.onTilePlaced!(marsBot, true, TileType.OCEAN, space);
    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(calls).deep.eq([`advanceTrack(${BUILDING})`]);
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

    effect.onTilePlaced!(marsBot, false, TileType.OCEAN, marsBot.game.board.spaces[0]);

    expect(marsBot.mcKeptThroughIntervention).eq(4);
  });
});
