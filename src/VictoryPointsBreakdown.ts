import {CardName} from './CardName';
import {Player} from './Player';

export type VictoryPoints = 'terraformRating' | 'greenery' | 'city' | 'moon colony' | 'moon mine' | 'moon road';

export class VictoryPointsBreakdown {
    public terraformRating: number = 0;
    public milestones: number = 0;
    public awards: number = 0;
    public greenery: number = 0;
    public city: number = 0;
    public moonColonies: number = 0;
    public moonMines: number = 0;
    public moonRoads: number = 0;
    public victoryPoints = 0;
    public total = 0;
    public detailsCards: Array<[CardName, number]> = [];
    public detailsOther: Array<[string, number]> = [];
    public detailsMilestones: Array<string> = [];
    public detailsAwards: Array<[string, number, number, string]> = [];

    public updateTotal(): void {
      this.total = 0;
      this.total += this.terraformRating;
      this.total += this.milestones;
      this.total += this.awards;
      this.total += this.greenery;
      this.total += this.city;
      this.total += this.moonColonies;
      this.total += this.moonMines;
      this.total += this.moonRoads;
      this.total += this.victoryPoints;
    }

    public cardVPs(cardName: CardName, points: number) {
      this.victoryPoints += points;
      this.detailsCards.push([cardName, points]);
    }

    public otherVPs(description: string, points: number) {
      this.victoryPoints += points;
      this.detailsOther.push([description, points]);
    }

    public milestoneVPs(name: string, points: number) {
      this.milestones += points;
      this.detailsMilestones.push(name);
    }

    public awardVPs(name: string, points: number, place: number, fundedBy: Player) {
      this.awards += points;
      this.detailsAwards.push([name, points, place, fundedBy.name]);
    }

    public setVictoryPoints(key: VictoryPoints, points: number) {
      switch (key) {
      case 'terraformRating':
        this.terraformRating += points;
        break;
      case 'greenery':
        this.greenery += points;
        break;
      case 'city':
        this.city += points;
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
      default:
        console.warn('Unknown victory point constraint ' + key);
        break;
      }
    }
}
