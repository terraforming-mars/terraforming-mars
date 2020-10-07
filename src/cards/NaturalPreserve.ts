
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { TileType } from "../TileType";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class NaturalPreserve implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.NATURAL_PRESERVE;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => game.board.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined).length === 0);
    }
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 4 + player.getRequirementsBonus(game) && this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for special tile next to no other tile", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.NATURAL_PRESERVE });
            player.addProduction(Resources.MEGACREDITS);
            return undefined;
        });
    }
    public getVictoryPoints() {
        return 1;
    }
}
