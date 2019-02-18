
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class DomedCrater implements IProjectCard {
    public cost: number = 24;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Domed Crater";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Oxygen must be 7% or less. Gain 3 plants and place a city tile. Decrease your energy production 1 step and increase mega credit production 3 steps. Gain a victory point.";
    public description: string = "A spacious area for a great city.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() > 7) {
            return Promise.reject("Oxygen must be 7% or less");
        }
        if (player.energyProduction < 1) {
            return Promise.reject("Need energy production");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
                try { game.addCityTile(player, space.id); }
                catch (err) { reject(err); return; }
                player.plants += 3;
                player.energyProduction--;
                player.megaCreditProduction += 3;
                player.victoryPoints++;
                resolve();
            }));
        });
    }
}
