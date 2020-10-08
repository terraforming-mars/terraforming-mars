
import { TileType } from "../TileType";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { SpaceType } from "../SpaceType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class MoholeArea implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MOHOLE_AREA;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        return new SelectSpace("Select an ocean space for special tile", game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addTile(player, SpaceType.OCEAN, space, { tileType: TileType.MOHOLE_AREA });
            player.addProduction(Resources.HEAT,4);
            return undefined;
        });
    }
}

