
import { IProjectCard } from "./IProjectCard";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class CorporateStronghold implements IProjectCard {
    public cost: number = 11;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Corporate Stronghold";
    public text: string = "Decrease your energy production 1 step and increase your mega credit production 3 steps. Place a city tile. Lose 2 victory points.";
    public description: string = "A city exclusively devoted to your corporation.";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.energyProduction--;
            player.megaCreditProduction += 3;
            player.victoryPoints -= 2;
            return undefined;
        });
    }
}
