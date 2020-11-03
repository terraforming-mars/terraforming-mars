import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";
import { ResourceType } from "../../ResourceType";

export class FloaterLeasing implements IProjectCard {
    public cost = 3;
    public tags = [];
    public name = CardName.FLOATER_LEASING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, Math.floor(player.getResourceCount(ResourceType.FLOATER) / 3));
      return undefined;
    }
}

