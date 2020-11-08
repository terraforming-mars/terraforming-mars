import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { SelectHowToPayDeferred } from "../../deferredActions/SelectHowToPayDeferred";

export class HugeAsteroid extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.HUGE_ASTEROID;
    public canPlay(player: Player, _game: Game) {
        return player.canAfford(5);
    }
    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 3);
        game.defer(new SelectHowToPayDeferred(player, 5, false, false));
        return undefined;
    }
}
