
import { Player } from "../../Player";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { SelectSpace } from "../../inputs/SelectSpace";
import { TileType } from "../../TileType";
import { ISpace } from "../../ISpace";

export class MagneticFieldGeneratorsPromo implements IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MAGNETIC_FIELD_GENERATORS_PROMO;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 4;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-4);
        player.setProduction(Resources.PLANTS,2);
        player.increaseTerraformRatingSteps(3, game);

        const availableSpaces = game.board.getAvailableSpacesOnLand(player);
        if (availableSpaces.length < 1) return undefined;
        
        return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.MAGNETIC_FIELD_GENERATORS });
            return undefined;
        });
    }
} 
