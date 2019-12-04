
import { TileType } from "../TileType";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { SpaceType } from "../SpaceType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class MoholeArea implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mohole Area";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select an ocean space for special tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addTile(player, SpaceType.OCEAN, space, { tileType: TileType.SPECIAL });
            player.heatProduction += 4;
            return undefined;
        });
    }
}

