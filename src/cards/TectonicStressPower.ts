
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TectonicStressPower implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Tectonic Stress Power";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 2 science tags. Increase your energy production 3 steps. Gain 1 VP";
    public description: string = "After finding ways to predict earthquakes, it was only a matter of time before it became feasible to exploit the enormous energies involves.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.getTagCount(Tags.SCIENCE) < 2) {
                reject("Requires 2 science tags");
                return;
            }
            player.energyProduction += 3;
            player.victoryPoints++;
            resolve(); 
        });
    }
}
