
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';

export class IndustrialCenter implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Industrial Center";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.CITY).length > 0);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space adjacent to a city tile", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL });
            return undefined;
        });
    }
    public canAct(player: Player): boolean {
        return player.canAfford(7);
    }
    public action(player: Player, _game: Game) {
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, (htp) => {
                if (htp.megaCredits + htp.heat < 7) {
                    throw "Need to spend 7";
                }
                player.megaCredits -= 7;
                player.setProduction(Resources.STEEL);
                return undefined;
            });
        }
        player.megaCredits -= 7;
        player.setProduction(Resources.STEEL);
        return undefined;
    }
}

