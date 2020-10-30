import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { PlayProjectCard } from "../../deferredActions/PlayProjectCard";

export class EcologyExperts extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT, Tags.MICROBES];
    public name = CardName.ECOLOGY_EXPERTS;
    public getRequirementBonus(player: Player): number {
        if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
            // Magic number high enough to always ignore requirements.
            return 50;
        }
        return 0;
    }
    public play(player: Player, game: Game) {  
        player.addProduction(Resources.PLANTS);
        game.defer(new PlayProjectCard(player, game));
        return undefined;
    }
}
