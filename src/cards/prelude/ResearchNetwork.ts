import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { DrawCards } from "../../deferredActions/DrawCards";

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags = [Tags.WILDCARD];
    public name = CardName.RESEARCH_NETWORK;
    public play(player: Player, game: Game) {     
        player.addProduction(Resources.MEGACREDITS);
        game.defer(new DrawCards(player, game, 3));
        return undefined;
    }
}
