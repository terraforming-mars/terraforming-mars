import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { SelectHowToPayDeferred } from "../../deferredActions/SelectHowToPayDeferred";

export class BusinessEmpire extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.BUSINESS_EMPIRE;
    public canPlay(player: Player, _game: Game) {
        if (player.isCorporation(CardName.MANUTECH)) return true;
        return player.canAfford(6);
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.MEGACREDITS, 6);
        game.defer(new SelectHowToPayDeferred(player, 6, false, false));
        return undefined;
    }
}

