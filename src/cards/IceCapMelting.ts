
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
    public text: string = "Requires +2C or warmer. Place 1 ocean tile.";
    public description: string = "Getting the water back from the poles.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 2 - (2 * player.requirementsBonus);
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for ocean", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            return undefined;
        });
    }
}
