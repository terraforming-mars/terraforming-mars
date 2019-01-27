
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class PermafrostExtraction implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public cost: number = 8;
    public name: string = "Permafrost Extraction";
    public text: string = "Requires -8C or warmer. Place 1 ocean tile.";
    public description: string = "Thawing the subsurface";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.getTemperature() < -8) {
                reject("Temperature must be -8C or warmer");
                return;
            }
            player.setWaitingFor(new SelectSpace(this, "Select space for ocean tile", (space: ISpace) => {
                try { game.addOceanTile(player, space.id); }
                catch (err) { reject(err); return; }
                resolve();
            }));
        });
    }
}
