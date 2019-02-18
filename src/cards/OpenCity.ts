
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class OpenCity implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Open City";
    public text: string = "Requires 12% oxygen. Decrease your energy production 1 step and increase your mega credit production 4 steps. Gain 2 plants and place a city tile. Gain 1 victory point.";
    public description: string = "Not very comfortable conditions yet, but what freedom!!";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 12) {
            return Promise.reject("Requires 12% oxygen");
        }
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production to decrease");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
                try { game.addCityTile(player, space.id); }
                catch (err) { reject(err); return; }
                player.energyProduction--;
                player.megaCreditProduction += 4;
                player.plants += 2;
                player.victoryPoints++;
                resolve();
            }));
        });
    }
}
