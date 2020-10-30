
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { CardName } from "../CardName";

export class InventionContest implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 2;
    public tags = [Tags.SCIENCE];
    public name = CardName.INVENTION_CONTEST;

    public play(player: Player, game: Game) {
        const cardsDrawn: Array<IProjectCard> = [
            game.dealer.dealCard(),
            game.dealer.dealCard(),
            game.dealer.dealCard()
        ];
        return new SelectCard("Select card to take into hand", "Take", cardsDrawn, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.push(foundCards[0]);
            cardsDrawn
                .filter((c) => c !== foundCards[0])
                .forEach((c) => game.dealer.discard(c));
            return undefined;
        });
    }
}
