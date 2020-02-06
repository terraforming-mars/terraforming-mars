
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MediaArchives implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Media Archives";

    public play(player: Player, game: Game) {
        let allPlayedEvents = 0;
        game.getPlayers().forEach((player: Player) => {
            player.playedCards.forEach((card) => {
                if (card.cardType === CardType.EVENT) {
                    allPlayedEvents++;
                }
            });
        });
        player.megaCredits += allPlayedEvents;
        return undefined;
    }
}
