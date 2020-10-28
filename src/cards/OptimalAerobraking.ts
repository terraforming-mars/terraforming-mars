import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardEffect } from "./CauseAndEffect";

export class OptimalAerobraking implements IProjectCard {
    public cost = 7;
    public tags = [Tags.SPACE];
    public cardType = CardType.ACTIVE;
    public name = CardName.OPTIMAL_AEROBRAKING;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cardType === CardType.EVENT && card.tags.indexOf(Tags.SPACE) !== -1) {
            player.megaCredits += 3;
            player.heat += 3;
        }
    }
    public play() {
        return undefined;
    }

    public metadata: CardMetadata = {
        cardNumber: "031",
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardBonus.titanium(1).played(), CardBonus.event(1).played()],
                    [CardBonus.megacredits(3), CardBonus.heat(3)],
                    "When you play a Space Event, you gain 3 MC and 3 heat."
                ),
            ]),
        ],
    };
}
