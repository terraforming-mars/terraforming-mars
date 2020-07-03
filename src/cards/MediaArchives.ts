
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { LogHelper } from "../components/LogHelper";
import { Resources } from "../Resources";

export class MediaArchives implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.MEDIA_ARCHIVES;

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
        LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, allPlayedEvents);
        return undefined;
    }
}
