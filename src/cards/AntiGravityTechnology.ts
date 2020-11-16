import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class AntiGravityTechnology implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SCIENCE];
  public name = CardName.ANTI_GRAVITY_TECHNOLOGY;
  public cardType = CardType.ACTIVE;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 7;
  }
  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 3;
  }
}
