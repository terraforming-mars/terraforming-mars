import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class AntiGravityTechnology implements IProjectCard {
    public cost: number = 14;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = 'Anti-Gravity Technology';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 7;
    }
    public getCardDiscount() {
      return 2;
    }
    public play(player: Player) {
      player.victoryPoints += 3;
      return undefined;
    }
}
