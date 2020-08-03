import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceBonus } from "../SpaceBonus";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { LogHelper } from "../components/LogHelper";

export class MiningRights implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MINING_RIGHTS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public bonusResource: Resources | undefined = undefined;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space with a steel or titanium placement bonus", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.MINING_RIGHTS });
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
