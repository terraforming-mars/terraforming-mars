import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EccentricSponsor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ECCENTRIC_SPONSOR;

    public getCardDiscount(player: Player, _game: Game) {
        if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
            return 25;
        }
        return 0;
    }

    public play() {
        return undefined;
    }

    public addPlayCardInterrupt(player: Player, game: Game) {
        if (player.getPlayableCards(game).length > 0) {
            game.interrupts.push({
                player: player,
                playerInput: player.playProjectCard(game)
            });
        }
    }
}

