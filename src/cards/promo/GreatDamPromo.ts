import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardType } from "../CardType";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { SelectSpace } from "../../inputs/SelectSpace";
import { TileType } from "../../TileType";
import { ISpace } from "../../ISpace";

export class GreatDamPromo implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.GREAT_DAM_PROMO;
    public canPlay(player: Player, game: Game): boolean {
        const meetsOceanRequirements = game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
        const canPlaceTile = this.getAvailableSpaces(player, game).length > 0;
        
        return meetsOceanRequirements && canPlaceTile;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,2);

        const availableSpaces = this.getAvailableSpaces(player, game);
        if (availableSpaces.length < 1) return undefined;

        return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.GREAT_DAM });
            return undefined;
        });
    }
    public getVictoryPoints() {
        return 1;
    }
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
            .filter(
                (space) => game.board.getAdjacentSpaces(space).filter(
                    (adjacentSpace) => adjacentSpace.tile !== undefined &&
                  adjacentSpace.tile.tileType === TileType.OCEAN
                ).length > 0
            );
      }
}

