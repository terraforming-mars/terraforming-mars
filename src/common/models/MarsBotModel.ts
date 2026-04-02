import {DifficultyLevel, TrackAction, CubeType} from '../automa/AutomaTypes';
import {Tag} from '../cards/Tag';
import {CardName} from '../cards/CardName';
import {Color} from '../Color';
import {MADetail} from '../game/VictoryPointsBreakdown';
import {GlobalParameter} from '../GlobalParameter';

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
  detailsMilestones: ReadonlyArray<MADetail>;
  detailsAwards: ReadonlyArray<MADetail>;
};

export type MarsBotModel = {
  name: string;
  color: Color;
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
  globalParameterSteps?: Record<GlobalParameter, number>;
  vpByGeneration?: ReadonlyArray<number>;
};
