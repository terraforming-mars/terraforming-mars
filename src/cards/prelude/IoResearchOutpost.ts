import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class IoResearchOutpost extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SCIENCE];
    public name: string = "Io Research Outpost";
    public play(player: Player, game: Game) {     
        player.setProduction(Resources.TITANIUM);
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}

