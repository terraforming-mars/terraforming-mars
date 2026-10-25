import {Tag} from '@/common/cards/Tag';
import {TrackDefinition} from '@/common/automa/AutomaTypes';
import {GameOptions} from '@/server/game/GameOptions';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {MarsBotTags} from '@/server/automa/MarsBotTags';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {testGame} from '../TestGame';

type FakeMarsBotOptions = Partial<Omit<IMarsBot, 'game' | 'player' | 'marsBotBoard'>> & {
  /** The tracks on the bot's board. Defaults to the Tharsis board. */
  tracks?: ReadonlyArray<TrackDefinition>;
  gameOptions?: Partial<GameOptions>;
};

/**
 * Creates a bot with only what milestones and awards read: the game, a player that reads its tags
 * off the board's tracks, the board, and the members given in `options`.
 */
export function fakeMarsBot(options: FakeMarsBotOptions = {}): IMarsBot {
  const {tracks = THARSIS_MARSBOT_BOARD, gameOptions, ...members} = options;
  const [game, player] = testGame(2, gameOptions);
  const marsBotBoard = new MarsBotBoard(tracks);
  player.tags = new MarsBotTags(player, marsBotBoard);
  return {game, player, marsBotBoard, ...members} as unknown as IMarsBot;
}

/** Moves the marker of the track that carries `tag` to space `position`. */
export function setTrack(bot: IMarsBot, tag: Tag, position: number): void {
  const index = bot.marsBotBoard.tagToTrack[tag];
  if (index === undefined) {
    throw new Error(`No track carries ${tag}`);
  }
  bot.marsBotBoard.tracks[index].position = position;
}

/** Moves the marker of every track, Venus included, to space `position`. */
export function setAllTracks(bot: IMarsBot, position: number): void {
  for (const track of bot.marsBotBoard.tracks) {
    track.position = position;
  }
}
