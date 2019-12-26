import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';

export class AdaptationTechnology implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = 'Adaptation Technology';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
      return true;
    }
    public getRequirementBonus(): number {
      return 2;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
