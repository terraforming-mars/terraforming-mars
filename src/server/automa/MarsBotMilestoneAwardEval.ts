import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

/** Every track position, the Venus track included when in play. */
export function marsBotAllTrackPositions(bot: IMarsBot): Array<number> {
  return bot.marsBotBoard.tracks.map((track) => track.position);
}
