import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { BuildColony } from "../../deferredActions/BuildColony";

export class AerospaceMission extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.AEROSPACE_MISSION;

    public canPlay(player: Player, _game: Game, bonusMc?: number) {
        const requiredPayment = 14 - (bonusMc || 0);
      
        if (requiredPayment <= 0) return true;
        return player.canAfford(requiredPayment);
    }

    public play(player: Player, game: Game) {
        player.megaCredits -= 14;
        game.defer(new BuildColony(player, game, false, "Select where to build the first colony"));
        game.defer(new BuildColony(player, game, false, "Select where to build the second colony"));
        return undefined;
    }
}
