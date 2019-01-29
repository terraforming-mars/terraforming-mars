
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class LakeMarineris implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [];
    public name: string = "Lake Marineris";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 0C or warmer. Place 2 ocean tiles. Gain 2 victory points.";
    public description: string = "Filling the Valles Marineris takes a lot of water";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < 0) {
            return Promise.reject("Requires 0C or warmer");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        player.victoryPoints += 2;
                        resolve();
                    },
                    new SelectSpace(this.name, "Select space for 1st ocean tile", (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); return; }
                    }),
                    new SelectSpace(this.name, "Select space for 2nd ocean tile", (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); return; }
                    })
                )
            );
        });
    }
}
