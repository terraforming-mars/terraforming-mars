
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class CupolaCity implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Cupola City";
    public text: string = "Oxygen must be 9% or less. Place a city tile. Decrease your energy production 1 step and increase your mega credit production 3 steps.";
    public description: string = "In a thin atmosphere, normal pressure can hold a protective dome over the city.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 9 && player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() > 9) {
            throw "Oxygen must be 9% or less.";
        }
        if (player.energyProduction < 1) {
            throw "Must have energy production to decrease";
        }
        return new SelectSpace(this.name, "Select a space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.energyProduction--;
            player.megaCreditProduction += 3;
            return undefined;
        });
    }
}
