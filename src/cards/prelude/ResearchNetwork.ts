import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: CardName = CardName.RESEARCH_NETWORK;
    public play(player: Player, game: Game) {     
        player.addProduction(Resources.MEGACREDITS);
        for (let i = 0; i < 3; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}

