
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class EarthCatapult implements IProjectCard {
  public cost: number = 23;
  public nonNegativeVPIcon: boolean = true;
  public tags: Array<Tags> = [Tags.EARTH];
  public name: string = 'Earth Catapult';
  public cardType: CardType = CardType.ACTIVE;
  public canPlay(): boolean {
    return true;
  }
  public getCardDiscount() {
    return 2;
  }
  public play(player: Player) {
    player.victoryPoints += 2;
    return undefined;
  }
}
