import {Tags} from './common/cards/Tags';
import {IVictoryPointsBreakdown} from './common/game/IVictoryPointsBreakdown';

export type VictoryPoints = 'terraformRating' | 'milestones' | 'awards' | 'greenery' | 'city' | 'escapeVelocity' | 'moon colony' | 'moon mine' | 'moon road' | 'planetary tracks' | 'victoryPoints';

export class VictoryPointsBreakdown {
  public readonly points: IVictoryPointsBreakdown = {
    terraformRating: 0,
    milestones: 0,
    awards: 0,
    greenery: 0,
    city: 0,
    escapeVelocity: 0,
    moonColonies: 0,
    moonMines: 0,
    moonRoads: 0,
    planetaryTracks: 0,
    victoryPoints: 0,
    total: 0,
    detailsCards: [],
    detailsMilestones: [],
    detailsAwards: [],
    detailsPlanetaryTracks: [],
  };

  public updateTotal(): void {
    this.points.total = 0;
    this.points.total += this.points.terraformRating;
    this.points.total += this.points.milestones;
    this.points.total += this.points.awards;
    this.points.total += this.points.greenery;
    this.points.total += this.points.city;
    this.points.total += this.points.escapeVelocity;
    this.points.total += this.points.moonColonies;
    this.points.total += this.points.moonMines;
    this.points.total += this.points.moonRoads;
    this.points.total += this.points.planetaryTracks;
    this.points.total += this.points.victoryPoints;
  }

  public setVictoryPoints(key: VictoryPoints, points: number, message?: string) {
    switch (key) {
    case 'terraformRating':
      this.points.terraformRating += points;
      break;
    case 'milestones':
      this.points.milestones += points;
      if (message !== undefined) this.points.detailsMilestones.push(message+':'+points);
      break;
    case 'awards':
      this.points.awards += points;
      if (message !== undefined) this.points.detailsAwards.push(message+':'+points);
      break;
    case 'greenery':
      this.points.greenery += points;
      break;
    case 'city':
      this.points.city += points;
      break;
    case 'escapeVelocity':
      this.points.escapeVelocity += points;
      break;
    case 'victoryPoints':
      this.points.victoryPoints += points;
      if (message !== undefined) this.points.detailsCards.push({cardName: message, victoryPoint: points});
      break;
    case 'moon colony':
      this.points.moonColonies += points;
      break;
    case 'moon mine':
      this.points.moonMines += points;
      break;
    case 'moon road':
      this.points.moonRoads += points;
      break;
    case 'planetary tracks':
      this.points.planetaryTracks += points;
      if (message !== undefined) this.points.detailsPlanetaryTracks.push({tag: message as Tags, points});
      break;
    default:
      console.warn('Unknown victory point constraint ' + key);
      break;
    }
  }
}
