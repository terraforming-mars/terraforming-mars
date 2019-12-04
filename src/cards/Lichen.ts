
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class Lichen implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Lichen";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -24 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction++;
        return undefined;
    }
}

