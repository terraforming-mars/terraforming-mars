
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class CarbonateProcessing implements IProjectCard {
    public cost = 6;
    public tags = [Tags.STEEL];
    public name = CardName.CARBONATE_PROCESSING;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY,-1);
      player.addProduction(Resources.HEAT,3);
      return undefined;
    }
}
