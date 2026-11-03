import {Tag} from '@/common/cards/Tag';
import {TrackDefinition} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';

/**
 * Creates a bot with only a board.
 *
 * Upstream has no `IMarsBot` yet, and the milestone and award overrides read only the board.
 */
export function fakeMarsBot(tracks: ReadonlyArray<TrackDefinition> = THARSIS_MARSBOT_BOARD): IMarsBot {
  return {marsBotBoard: new MarsBotBoard(tracks)} as unknown as IMarsBot;
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
