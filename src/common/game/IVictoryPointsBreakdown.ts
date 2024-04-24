import {Tag} from '../cards/Tag';

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
  detailsMilestones: Array<{message: string, messageArgs?: Array<string>, victoryPoint: number}>;
  detailsAwards: Array<{message: string, messageArgs?: Array<string>, victoryPoint: number}>;
  detailsPlanetaryTracks: Array<{tag: Tag, points: number}>;
}
