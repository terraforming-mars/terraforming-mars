import {DifficultyLevel, TrackAction} from './AutomaTypes';
import {GlobalParameter} from '../GlobalParameter';

type CubeType = 'white' | 'black' | 'credit';

/** Track state sent to the client for display. */
export interface MarsBotTrackModel {
  num: number;
  tagNames: ReadonlyArray<string>;
  position: number;
  maxPosition: number;
  /** Action at each position (null = no action). */
  layout?: ReadonlyArray<TrackAction | null>;
}

/** MarsBot VP breakdown sent to client at game end. */
export interface MarsBotVPModel {
  terraformRating: number;
  milestones: number;
  awards: number;
  greenery: number;
  cityAdjacentGreenery: number;
  neuralInstance: number;
  mcToVP: number;
  cardVP: number;
  total: number;
}

/** MarsBot state model sent to the client. */
export interface MarsBotModel {
  difficulty: DifficultyLevel;
  tracks: ReadonlyArray<MarsBotTrackModel>;
  terraformRating: number;
  mcSupply: number;
  actionDeckSize: number;
  bonusDeckSize: number;
  /** VP breakdown (always populated). */
  vpBreakdown?: MarsBotVPModel;
  /** Whether MarsBot wins by generation limit. */
  instantWin?: boolean;
  /** Corporation ID if playing with corp rules. */
  corpId?: string;
  /** Corporation display name. */
  corpName?: string;
  /** Corporation effect description for the player. */
  corpDescription?: string;
  /** Track cubes placed by the corporation. */
  trackCubes?: ReadonlyArray<{trackNum: number, position: number, cubeType: CubeType}>;
  /** Current MC-per-VP ratio (undefined if before conversion window). */
  mcPerVP?: number;
  /** Current VP from MC at this ratio. */
  mcVP?: number;
  /** Global parameter contributions (temp steps, oxygen steps, oceans placed, etc.). */
  globalParameterSteps?: Partial<Record<GlobalParameter, number>>;
  /** VP total per generation (for chart). */
  vpByGeneration?: ReadonlyArray<number>;
}
