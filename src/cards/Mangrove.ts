
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceType } from "../SpaceType";
import { ISpace } from "../ISpace";

export class Mangrove implements IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Mangrove";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 4 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        return new SelectSpace("Select ocean space for greenery tile", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
        });
    }
}
