
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class EnergySaving implements IProjectCard {
    public cardType = CardType.AUTOMATED;
    public cost = 15;
    public tags = [Tags.ENERGY];
    public name = CardName.ENERGY_SAVING;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY,game.getCitiesInPlay());
      return undefined;
    }
}
