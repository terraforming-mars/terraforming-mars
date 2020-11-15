import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';

export class MercurianAlloys implements IProjectCard {
    public name = CardName.MERCURIAN_ALLOYS;
    public cost = 3;
    public tags = [Tags.SPACE];
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play(player: Player) {
      player.increaseTitaniumValue();
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.decreaseTitaniumValue();
    }
}
