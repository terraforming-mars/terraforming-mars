import {Tag} from '../cards/Tag';

export type MADetail = {message: string, messageArgs?: Array<string>, victoryPoint: number};

export interface IVictoryPointsBreakdown {
  terraformRating: number;
  milestones: number;
  awards: number;
  greenery: number;
  city: number;
  escapeVelocity: number;
  moonHabitats: number;
  moonMines: number;
  moonRoads: number;
  planetaryTracks: number;
  victoryPoints: number;
  total: number;
  detailsCards: Array<{cardName: string, victoryPoint: number}>;
  detailsMilestones: Array<MADetail>;
  detailsAwards: Array<MADetail>;
  detailsPlanetaryTracks: Array<{tag: Tag, points: number}>;
}
