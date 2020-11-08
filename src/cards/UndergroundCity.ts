
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class UndergroundCity implements IProjectCard {
    public cost = 18;
    public tags = [Tags.CITY, Tags.STEEL];
    public name = CardName.UNDERGROUND_CITY;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 2 && game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.board.getAvailableSpacesForCity(player), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            player.addProduction(Resources.ENERGY,-2);
            player.addProduction(Resources.STEEL,2);
            return undefined;
        });
    }
}
