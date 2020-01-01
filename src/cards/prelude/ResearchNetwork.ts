import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: string = "Research Network";
    public play(player: Player, game: Game) {     
        player.setProduction(Resources.MEGACREDITS);
        for (let i = 0; i < 3; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}

