
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class LakeMarineris implements IProjectCard {
    public cost: number = 18;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [];
    public name: string = "Lake Marineris";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 0C or warmer. Place 2 ocean tiles. Gain 2 victory points.";
    public description: string = "Filling the Valles Marineris takes a lot of water";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 0 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player, game: Game) {
        let available = game.getAvailableSpacesForOcean(player);
        if (available.length === 0) {
            player.victoryPoints += 2;
            return undefined;
        }
        return new SelectSpace("Select space for first ocean tile", available, (space: ISpace) => {
            game.addOceanTile(player, space.id);
            available = game.getAvailableSpacesForOcean(player);
            if (available.length === 0) { 
                player.victoryPoints += 2;
                return undefined;
            }
            return new SelectSpace("Select space for second ocean tile", available, (space: ISpace) => {
                game.addOceanTile(player, space.id);
                player.victoryPoints += 2;
                return undefined;
            });
        });
    }
}
