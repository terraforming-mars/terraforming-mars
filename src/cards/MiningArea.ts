
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { SpaceBonus } from "../SpaceBonus";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { LogHelper } from "../components/LogHelper";

export class MiningArea implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public name: CardName = CardName.MINING_AREA;
    public bonusResource: Resources | undefined = undefined;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)
                .filter((space) => game.board.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType !== TileType.OCEAN && adjacentSpace.player === player).length > 0);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select a space with steel or titanium placement bonus adjacent to one of your tiles", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.MINING_AREA });
            if (foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1) {
                player.setProduction(Resources.STEEL);
                this.bonusResource = Resources.STEEL;
                LogHelper.logGainProduction(game, player, Resources.STEEL);
            } else if (foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                player.setProduction(Resources.TITANIUM);
                this.bonusResource = Resources.TITANIUM;
                LogHelper.logGainProduction(game, player, Resources.TITANIUM);
            }
            return undefined;
        });
    }
}

