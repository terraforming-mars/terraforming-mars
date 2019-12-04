
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class OpenCity implements IProjectCard {
    public cost: number = 23;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Open City";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 12 - player.getRequirementsBonus(game) && player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.energyProduction--;
            player.megaCreditProduction += 4;
            player.plants += 2;
            player.victoryPoints++;
            return undefined;
        });
    }
}
