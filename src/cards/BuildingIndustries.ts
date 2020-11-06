
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class BuildingIndustries implements IProjectCard {
    public cost = 6;
    public tags = [Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BUILDING_INDUSTRIES;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY,-1);
      player.addProduction(Resources.STEEL,2);
      return undefined;
    }
}
