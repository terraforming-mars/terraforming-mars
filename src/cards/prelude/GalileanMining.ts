import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { SelectHowToPayDeferred } from "../../deferredActions/SelectHowToPayDeferred";

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags = [Tags.JOVIAN];
    public name = CardName.GALILEAN_MINING;
    public canPlay(player: Player, _game: Game) {
        return player.canAfford(5);
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.TITANIUM, 2);
        game.defer(new SelectHowToPayDeferred(player, 5, false, false));
        return undefined;
    }
}

