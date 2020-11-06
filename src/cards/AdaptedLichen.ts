
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class AdaptedLichen implements IProjectCard {
    public cost = 9;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ADAPTED_LICHEN;
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
}
