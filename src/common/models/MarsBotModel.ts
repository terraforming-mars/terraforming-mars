import {DifficultyLevel, TrackAction} from '../automa/AutomaTypes';
import {Tag} from '../cards/Tag';
import {CardName} from '../cards/CardName';
import {GlobalParameter} from '../GlobalParameter';

type CubeType = 'white' | 'black' | 'credit';

export type MarsBotTrackModel = {
  tags: ReadonlyArray<Tag>;
  position: number;
  layout?: ReadonlyArray<TrackAction | undefined>;
};

export type MarsBotVPModel = {
  terraformRating: number;
  milestones: number;
  awards: number;
  greenery: number;
  cityAdjacentGreenery: number;
  neuralInstance: number;
  mcToVP: number;
  cardVP: number;
  total: number;
};

export type MarsBotModel = {
  difficulty: DifficultyLevel;
  tracks: ReadonlyArray<MarsBotTrackModel>;
  terraformRating: number;
  mcSupply: number;
  actionDeckSize: number;
  bonusDeckSize: number;
  vpBreakdown: MarsBotVPModel;
  instantWin?: boolean;
  corpName?: CardName;
  corpDescription?: string;
  trackCubes?: ReadonlyArray<{trackIndex: number, position: number, cubeType: CubeType}>;
  mcPerVP?: number;
  mcVP?: number;
  globalParameterSteps?: Partial<Record<GlobalParameter, number>>;
  vpByGeneration?: ReadonlyArray<number>;
};
