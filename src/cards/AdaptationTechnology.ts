import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import { CardName } from '../CardName';

export class AdaptationTechnology implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.ADAPTATION_TECHNOLOGY;
    public cardType: CardType = CardType.ACTIVE;

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
