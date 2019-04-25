
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Worms implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Worms";
    public text: string = "Requires 4% oxygen. Increase your plant production 1 step for every 2 microbe tags you have, including this.";
    public description: string = "Milling about in the soil, 'processing' it";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4;
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 4) {
            throw "Requires 4% oxygen";
        }
        player.plantProduction += Math.floor((player.getTagCount(Tags.MICROBES) + 1) / 2);
        return undefined;
    }
}
