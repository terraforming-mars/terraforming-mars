
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
    public canPlay(_player: Player, game: Game): boolean {
        return game.getTemperature() >= -8;
    }
    public play(player: Player, game: Game) {
        if (game.getTemperature() < -8) {
            throw "Temperature must be -8C or warmer";
        }
        return new SelectSpace(this.name, "Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            return undefined;
        });
    }
}
