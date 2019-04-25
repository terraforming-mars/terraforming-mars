
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MediaGroup implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Media Group";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "After you play an event card, you gain 3 mega credit";
    public description: string = "Profiting on every spectacular story";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.cardType === CardType.EVENT) {
                player.megaCredits += 3;
            }
        });
        return undefined;
    }
}
