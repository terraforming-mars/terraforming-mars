
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class FoodFactory implements IProjectCard {
  public cost = 12;
  public tags = [Tags.STEEL];
  public name = CardName.FOOD_FACTORY;
  public cardType = CardType.AUTOMATED;
  public hasRequirements = false;
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.PLANTS) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS,-1);
    player.addProduction(Resources.MEGACREDITS,4);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
