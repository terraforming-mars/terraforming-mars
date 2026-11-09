import {TrackDefinition} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {corpTrackCubes} from '@/server/automa/corpTrackCubes';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';

const RECORDED = [
  'addFloaters',
  'gainMc',
  'raiseTR',
  'raiseTemperature',
  'placeOcean',
  'placeCity',
  'placeGreenery',
  'removeBonusCard',
  'resolveBonusCard',
  'addBonusCardToActionDeck',
  'addBonusCardToBonusDeck',
  'addBonusCardToBottomOfBonusDeck',
  'addProjectCardsToBonusDeck',
  'returnSetupBonusCardToBonusDeck',
  'maybeMoveBonusCardToActionDeck',
  'drawProjectCardsToActionDeck',
  'maybeDrawAndResolveProjectCard',
  'maybeDrawAndResolveProjectCardFirstTagOnly',
  'maybeDrawAndResolveBonusCard',
  'maybeClaimMilestone',
  'maybeFundAward',
] as const satisfies ReadonlyArray<keyof IMarsBot>;

export type RecordingMarsBot = {
  marsBot: IMarsBot;
  /** The calls a corporation made into the bot, in order, as `name(arguments)`. */
  calls: Array<string>;
  corpState: Map<string, number>;
};

/**
 * Creates a bot that records the calls a corporation makes into it instead of acting on them.
 *
 * It keeps corp state, and an advance moves the track's marker. `fields` sets any other field, the way
 * fakeMarsBot() takes them. The game has 1 player unless `fields` brings its own.
 */
export function recordingMarsBot(fields: Partial<IMarsBot> = {}): RecordingMarsBot {
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (name: string) => (...args: Array<unknown>) => calls.push(`${name}(${args.join(', ')})`) > 0;
  const marsBot: IMarsBot = fakeMarsBot({
    game: fields.game ?? testGame(1)[0],
    ...Object.fromEntries(RECORDED.map((name) => [name, record(name)])),
    advanceTrack: (trackIndex) => {
      record('advanceTrack')(trackIndex);
      marsBot.marsBotBoard.tracks[trackIndex].position++;
    },
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => corpState.set(key, value),
    ...fields,
  });
  return {marsBot, calls, corpState};
}

/** The cubes `corp` puts on a board of `tracks`, each as `tag cubeType position`, with the first tag of its track. */
export function trackCubes(corp: IMarsBotCorp, tracks: ReadonlyArray<TrackDefinition> = THARSIS_MARSBOT_BOARD): Array<string> {
  const board = new MarsBotBoard(tracks);
  return corpTrackCubes(corp, board).map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);
}
