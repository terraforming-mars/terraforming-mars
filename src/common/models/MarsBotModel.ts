import {DifficultyLevel, TrackAction, CubeType} from '../automa/AutomaTypes';
import {Tag} from '../cards/Tag';
import {CardName} from '../cards/CardName';
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
  vermin: number;
  turmoilVP: number; // T-13: 1 VP per party leader or chairman position
  corpVP: number; // VP the corporation adds at the end (Viron)
  total: number;
  detailsMilestones: ReadonlyArray<MADetail>;
  detailsAwards: ReadonlyArray<MADetail>;
};

export type MarsBotModel = {
  difficulty: DifficultyLevel;
  tracks: ReadonlyArray<MarsBotTrackModel>;
  terraformRating: number;
  megacredits: number;
  actionDeckSize: number;
  bonusDeckSize: number;
  vpBreakdown: MarsBotVPModel;
  instantWin: boolean;
  corpName?: CardName;
  corpDescription?: string;
  trackCubes?: ReadonlyArray<{trackIndex: number, position: number, cubeType: CubeType}>;
  mcPerVP?: number;
  mcVP?: number;
  globalParameterSteps: Record<GlobalParameter, number>;
  vpByGeneration: ReadonlyArray<number>;
};
