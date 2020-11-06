
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";

export class MediaGroup implements IProjectCard {
    public cost = 6;
    public tags = [Tags.EARTH];
    public name = CardName.MEDIA_GROUP;
    public cardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cardType === CardType.EVENT) {
            player.megaCredits += 3;
        }
    }
    public play() {
        return undefined;
    }
}
