import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class IoResearchOutpost extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SCIENCE];
    public name: CardName = CardName.IO_RESEARCH_OUTPOST;
    public play(player: Player, game: Game) {     
        player.addProduction(Resources.TITANIUM);
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}

