import {Tag} from '../cards/Tag';
import {Resource} from '../Resource';

/** Actions that can appear on MarsBot board track positions. */
export type TrackAction =
  | 'advance'       // Move cube 1 more space (may chain)
  | 'tr1' | 'tr2' | 'tr3' | 'tr4' | 'tr5' | 'tr6' | 'tr7' | 'tr8'
  | 'milestone'
  | 'award'
  | 'temperature' | 'temperature2'
  | 'greenery'
  | 'ocean'
  | 'city'
  | 'venus' | 'venus2'
  | 'floater' | 'floater2'
  | 'colony'        // Utopia Planitia: place a colony like Outer System Foothold
  | `tag_${number}`   // Advance track by index
  | `tag_${string}`;  // Advance track by tag name (e.g. 'tag_microbe')

/** A single track on the MarsBot board (19 positions: 0–18). */
export type TrackLayout = ReadonlyArray<TrackAction | undefined>;

/** Definition of one MarsBot track: which tags and production types map to it. */
export type TrackDefinition = {
  readonly tags: ReadonlyArray<Tag>;
  readonly productions: ReadonlyArray<Resource>;
  readonly layout: TrackLayout;
};


/** A corp cube's colour. `credit` is a silver resource cube, worth 5 M€. */
export type CubeType = 'white' | 'black' | 'credit';

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'brutal';

/** M€ MarsBot gains when it takes a Failed Action. */
export const FAILED_ACTION_MC = 5;
export const FAILED_ACTION_MC_EASY = 3;

export const MARSBOT_MAX_TRACK_POSITION = 18;
export const MARSBOT_STARTING_TR = 20;
export const MARSBOT_MAX_GENERATION = 20;
export const MARSBOT_MAX_GENERATION_PRELUDE = 18;

/** M€ MarsBot gets per adjacent ocean when its corporation is Lakefront Resorts. */
export const LAKEFRONT_OCEAN_BONUS = 3;

/** Gets the max generation for an automa game. */
export function getAutomaMaxGeneration(preludeExtension: boolean): number {
  return preludeExtension ? MARSBOT_MAX_GENERATION_PRELUDE : MARSBOT_MAX_GENERATION;
}

