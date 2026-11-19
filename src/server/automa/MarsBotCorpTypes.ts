import {Tag} from '../../common/cards/Tag';
import {CubeType} from '../../common/automa/AutomaTypes';

/** How the bot picks a card in the research draft. Each corp names one priority. */
export type MarsBotDraftPriority =
  | { type: 'tags'; tags: Array<Tag> }
  | { type: 'mostExpensive' }
  | { type: 'leastAdvancedTrack' }
  | { type: 'mostTags' };

/** A cube on the corp's track, including its type and position within a track. */
export type MarsBotTrackCube = {
  trackIndex: number;
  position: number;
  cubeType: CubeType;
};

/**
 * A corp cube printed on the track of a tag (Aridor's "Jovian track #6"), wherever that tag's
 * track sits on the map's MarsBot board.
 */
export type MarsBotTagTrackCube = {
  trackTag: Tag;
  position: number;
  cubeType: CubeType;
};
