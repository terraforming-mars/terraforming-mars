import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { DrawCards } from "../../deferredActions/DrawCards";

export class Biolab extends PreludeCard implements IProjectCard {
    public tags = [Tags.SCIENCE];
    public name = CardName.BIOLAB;
    public play(player: Player, game: Game) {
        player.addProduction(Resources.PLANTS);
        game.defer(new DrawCards(player, game, 3));
        return undefined;
    }
}

