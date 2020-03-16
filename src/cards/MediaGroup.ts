
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class MediaGroup implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = CardName.MEDIA_GROUP;
    public cardType: CardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cardType === CardType.EVENT) {
            player.megaCredits += 3;
        }
    }
    public play() {
        return undefined;
    }
}
