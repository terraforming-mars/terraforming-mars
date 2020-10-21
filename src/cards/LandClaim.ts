
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { CardName } from "../CardName";
import { LogHelper } from "../components/LogHelper";

export class LandClaim implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LAND_CLAIM;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getAvailableSpacesOnLand(player).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace(
            "Select space for claim", 
            game.board.getAvailableSpacesOnLand(player), 
            (foundSpace: ISpace) => {
                foundSpace.player = player;
                LogHelper.logBoardTileAction(game, player, foundSpace, "land claim");
                return undefined;
            }
        );
    }
}
