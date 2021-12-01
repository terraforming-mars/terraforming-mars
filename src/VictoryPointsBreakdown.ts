import {Tags} from './cards/Tags';

export type VictoryPoints = 'terraformRating' | 'milestones' | 'awards' | 'greenery' | 'city' | 'escapeVelocity' | 'moon colony' | 'moon mine' | 'moon road' | 'planetary tracks' | 'victoryPoints';

export class VictoryPointsBreakdown {
    public terraformRating: number = 0;
    public milestones: number = 0;
    public awards: number = 0;
    public greenery: number = 0;
    public city: number = 0;
    public escapeVelocity: number = 0;
    public moonColonies: number = 0;
    public moonMines: number = 0;
    public moonRoads: number = 0;
    public planetaryTracks: number = 0;
    public victoryPoints = 0;
    public total = 0;
    public detailsCards: Array<{cardName: string, victoryPoint: number}> = [];
    public detailsMilestones: Array<string> = [];
    public detailsAwards: Array<string> = [];
    public detailsPlanetaryTracks: Array<{tag: Tags, points: number}> = [];

    public updateTotal(): void {
      this.total = 0;
      this.total += this.terraformRating;
      this.total += this.milestones;
      this.total += this.awards;
      this.total += this.greenery;
      this.total += this.city;
      this.total += this.escapeVelocity;
      this.total += this.moonColonies;
      this.total += this.moonMines;
      this.total += this.moonRoads;
      this.total += this.planetaryTracks;
      this.total += this.victoryPoints;
    }

    public setVictoryPoints(key: VictoryPoints, points: number, message?: string) {
      switch (key) {
      case 'terraformRating':
        this.terraformRating += points;
        break;
      case 'milestones':
        this.milestones += points;
        if (message !== undefined) this.detailsMilestones.push(message+':'+points);
        break;
      case 'awards':
        this.awards += points;
        if (message !== undefined) this.detailsAwards.push(message+':'+points);
        break;
      case 'greenery':
        this.greenery += points;
        break;
      case 'city':
        this.city += points;
        break;
      case 'escapeVelocity':
        this.escapeVelocity += points;
        break;
      case 'victoryPoints':
        this.victoryPoints += points;
        if (message !== undefined) this.detailsCards.push({cardName: message, victoryPoint: points});
        break;
      case 'moon colony':
        this.moonColonies += points;
        break;
      case 'moon mine':
        this.moonMines += points;
        break;
      case 'moon road':
        this.moonRoads += points;
        break;
      case 'planetary tracks':
        this.planetaryTracks += points;
        if (message !== undefined) this.detailsPlanetaryTracks.push({tag: message as Tags, points});
        break;
      default:
        console.warn('Unknown victory point constraint ' + key);
        break;
      }
    }
}
