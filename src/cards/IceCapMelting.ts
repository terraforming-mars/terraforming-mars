
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class IceCapMelting implements IProjectCard {
    public cost: number = 5;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = "Ice Cap Melting";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 2 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player, game: Game) {
        if (game.noOceansAvailabe()) return undefined;

        return new SelectSpace(
            "Select space for ocean", 
            game.getAvailableSpacesForOcean(player), 
            (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            }
        );
    }
}
