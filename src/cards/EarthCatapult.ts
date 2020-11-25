import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {CardName} from '../CardName';

export class EarthCatapult implements IProjectCard {
  public cost = 23;
  public tags = [Tags.EARTH];
  public name = CardName.EARTH_CATAPULT;
  public cardType = CardType.ACTIVE;
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
