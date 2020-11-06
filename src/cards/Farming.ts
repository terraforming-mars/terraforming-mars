
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Farming implements IProjectCard {
  public cost = 16;
  public tags = [Tags.PLANT];
  public name = CardName.FARMING;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() >= 4 - (2 * player.getRequirementsBonus(game));
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS,2);
    player.addProduction(Resources.PLANTS,2);
    player.plants += 2;
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
