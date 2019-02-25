
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class SubterraneanReservoir implements IProjectCard {
    public cost: number = 11;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = "Subterranean Reservoir";
    public text: string = "Place 1 ocean tile.";
    public description: string = "Also known as an aquifer. Burst one open and you've got a lot of water.";
    public play(player: Player, game: Game) {
        return new SelectSpace(this.name, "Select space for ocean", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            game.addOceanTile(player, foundSpace.id);
            return undefined;
        });
    }
}

