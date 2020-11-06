
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Cartel implements IProjectCard {
    public cost = 8;
    public tags = [Tags.EARTH];
    public name = CardName.CARTEL;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
      return undefined;
    }
}
