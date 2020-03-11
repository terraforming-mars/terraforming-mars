
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import { CardName } from '../CardName';

export class EarthCatapult implements IProjectCard {
  public cost: number = 23;
  public tags: Array<Tags> = [Tags.EARTH];
  public name: string = CardName.EARTH_CATAPULT;
  public cardType: CardType = CardType.ACTIVE;
  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
