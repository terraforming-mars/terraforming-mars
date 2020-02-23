import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from '../../CardName';

export class RimFreighters implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = CardName.RIM_FREIGHTERS;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeDiscount++;
      return undefined;
    }
}
