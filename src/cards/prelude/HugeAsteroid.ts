import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class HugeAsteroid extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.HUGE_ASTEROID;
    public canPlay(player: Player, _game: Game, bonusMc?: number) {
        let requiredPayment = 5 - (bonusMc || 0);
        return requiredPayment <= 0 ? true : player.canAfford(requiredPayment);
    }
    public play(player: Player, game: Game) {
        player.megaCredits -= 5;
        return game.increaseTemperature(player, 3);
    }
}

