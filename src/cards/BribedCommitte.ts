
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class BribedCommitte implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.EVENT;
    public name: string = 'Bribed Committee';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.terraformRating += 2;
      player.victoryPoints -= 2;
      return undefined;
    }
}
