import {Tags} from '../cards/Tags';

export interface IVictoryPointsBreakdown {
  terraformRating: number;
  milestones: number;
  awards: number;
  greenery: number;
  city: number;
  escapeVelocity: number;
  moonColonies: number;
  moonMines: number;
  moonRoads: number;
  planetaryTracks: number;
  victoryPoints: number;
  total: number;
  detailsCards: Array<{cardName: string, victoryPoint: number}>;
  detailsMilestones: Array<string>;
  detailsAwards: Array<string>;
  detailsPlanetaryTracks: Array<{tag: Tags, points: number}>;
}
