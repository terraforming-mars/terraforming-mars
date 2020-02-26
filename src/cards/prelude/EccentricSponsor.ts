import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EccentricSponsor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = CardName.ECCENTRIC_SPONSOR;

    public getCardDiscount(player: Player, game: Game) {
        const lastCardPlayed = player.lastCardPlayedThisGeneration(game);
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            return 25;
        }
        return 0;
    }

    public play() {
        return undefined;
    }
}

