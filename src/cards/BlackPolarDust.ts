
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class BlackPolarDust implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [];
    public name: string = "Black Polar Dust";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Place an ocean tile. Decrease your mega credit production 2 steps and increase your heat production 3 steps.";
    public description: string = "The sprinkled dust absorbs heat from the sun. Must be renewed after each snowfall, though";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -3;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.megaCreditProduction -= 2;
            player.heatProduction += 3;
            return undefined;
        });
    }
}
