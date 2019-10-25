import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class IoResearchOutpost extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: string = "Io Research Outpost";
    public text: string = "Increase your titanium production 1 step. Draw 1 card.";
    public description: string = "Exploring the most volcanic place of the solar system";
    public play(player: Player, game: Game) {     
			player.titaniumProduction++;
			player.cardsInHand.push(game.dealer.dealCard());
            return undefined;
    }
}

