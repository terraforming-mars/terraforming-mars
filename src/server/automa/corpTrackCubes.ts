import {IMarsBotCorp} from './IMarsBotCorp';
import {MarsBotBoard} from './MarsBotBoard';
import {MarsBotTrackCube} from './MarsBotCorpTypes';

/**
 * The corp's cubes on this board: tag-named cubes go to the track that carries the tag, and cubes
 * on a track the board lacks (Venus without Venus Next) are left out.
 */
export function corpTrackCubes(corp: IMarsBotCorp, marsBotBoard: MarsBotBoard): Array<MarsBotTrackCube> {
  if (corp.trackCubes === undefined) {
    return [];
  }
  const cubes: Array<MarsBotTrackCube> = [];
  for (const cube of corp.trackCubes) {
    const trackIndex = 'trackTag' in cube ? marsBotBoard.tagToTrack[cube.trackTag] : cube.trackIndex;
    if (trackIndex !== undefined && trackIndex < marsBotBoard.tracks.length) {
      cubes.push({trackIndex, position: cube.position, cubeType: cube.cubeType});
    }
  }
  return cubes;
}

/** Keys cube positions in maps, and in the set of cubes that already triggered. */
export function trackCubeKey(trackIndex: number, position: number): string {
  return `${trackIndex}:${position}`;
}
