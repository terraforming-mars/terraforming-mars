import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardAction } from "./CauseAndEffect";

export class DevelopmentCenter implements IActionCard, IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE, Tags.STEEL];
    public name = CardName.DEVELOPMENT_CENTER;
    public cardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy > 0;
    }
    public action(player: Player, game: Game) {
        player.energy--;
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public metadata: CardMetadata = {
        cardNumber: "014",
        onPlay: [
            CardRow.add([
                CardAction.add(
                    [CardBonus.energy(1)],
                    [CardBonus.cards(1)],
                    "Spend 1 Energy to draw a card."
                ),
            ]),
        ],
    };
}
