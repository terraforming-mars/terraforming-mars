
import { SpaceType } from "../SpaceType";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";

export class EnergySaving implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Energy Saving";
    public text: string = "Increase your energy production 1 step for each city tile in play.";
    public description: string = "Minimizing urban energy spending";
    public play(player: Player, game: Game): void {
        game.getSpaces(SpaceType.LAND)
            .filter((space) => space.player !== undefined)
            .forEach((space) => {
                player.energyProduction++;
            });
    }
}
