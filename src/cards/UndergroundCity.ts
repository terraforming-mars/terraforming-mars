
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';

export class UndergroundCity implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Underground City";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return player.energyProduction >= 2 && game.getAvailableSpacesForCity(player).length >= 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesForCity(player), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            player.setProduction(Resources.ENERGY,-2);
            player.setProduction(Resources.STEEL,2);
            return undefined;
        });
    }
}
