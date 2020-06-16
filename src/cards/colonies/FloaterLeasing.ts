import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";
import { ResourceType } from "../../ResourceType";

export class FloaterLeasing implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.FLOATER_LEASING;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS, Math.floor(player.getResourceCount(ResourceType.FLOATER) / 3));
      return undefined;
    }
}

