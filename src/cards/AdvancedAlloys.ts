import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class AdvancedAlloys implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE];
    public name = CardName.ADVANCED_ALLOYS;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.increaseTitaniumValue();
      player.increaseSteelValue();
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.decreaseTitaniumValue();
      player.decreaseSteelValue();
    }
}
