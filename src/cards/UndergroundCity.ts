
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class UndergroundCity implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Underground City";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Place a city tile. Decrease your energy production 2 steps and increase your steel production 2 steps";
    public description: string = "Excavating is expensive, but gives both protection and building materials";
    public play(player: Player, game: Game): Promise<void> {
        if (player.energyProduction < 2) {
            return Promise.reject("Requires 2 energy production");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for city tile", (foundSpace: ISpace) => {
                try { game.addCityTile(player, foundSpace.id); }
                catch (err) { reject(err); return; }
                player.energyProduction -= 2;
                player.steelProduction += 2;
                resolve();
            }));
        });
    }
}
