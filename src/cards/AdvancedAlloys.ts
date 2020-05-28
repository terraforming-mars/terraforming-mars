import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { CardName } from '../CardName';

export class AdvancedAlloys implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.ADVANCED_ALLOYS;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
      player.increaseTitaniumValue();
      player.steelValue++;
      return undefined;
    }
}
