
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { SpaceBonus } from "../SpaceBonus";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class MiningArea implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Mining Area";
    public text: string = "Place a special tile on an area with a steel or titanium placement bonus, adjacent to another of your tiles. Increase your production of that resource 1 step.";
    public description: string = "It is easier to claim territories where you already have established activities.";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.player === player).length > 0);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        if (this.getAvailableSpaces(player, game).length === 0) {
            throw "No adjacent tile with placement bonus";
        }
        return new SelectSpace(this.name, "Select a space with steel or titanium placement bonus adjacent to one of your tiles", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL });
            if (foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1) {
                player.steelProduction++;
            }
            if (foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                player.titaniumProduction++;
            }
            return undefined;
        });
    }
}

