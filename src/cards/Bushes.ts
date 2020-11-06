
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Bushes implements IProjectCard {
    public cost = 10;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BUSHES;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -10 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS,2);
      player.plants += 2;
      return undefined;
    }
}
