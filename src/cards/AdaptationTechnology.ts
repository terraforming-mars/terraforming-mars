import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {CardName} from '../CardName';

export class AdaptationTechnology implements IProjectCard {
  public cost = 12;
  public tags = [Tags.SCIENCE];
  public name = CardName.ADAPTATION_TECHNOLOGY;
  public cardType = CardType.ACTIVE;

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
