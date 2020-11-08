import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { DrawCards } from "../../deferredActions/DrawCards";

export class IoResearchOutpost extends PreludeCard implements IProjectCard {
    public tags = [Tags.JOVIAN, Tags.SCIENCE];
    public name = CardName.IO_RESEARCH_OUTPOST;
    public play(player: Player, game: Game) {     
        player.addProduction(Resources.TITANIUM);
        game.defer(new DrawCards(player, game, 1));
        return undefined;
    }
}
