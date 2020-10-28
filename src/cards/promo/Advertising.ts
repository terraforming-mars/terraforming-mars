import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardBonus } from "../../cards/CardBonus";
import { CardEffect } from "../CauseAndEffect";
import { CardProductionBox } from "../../cards/CardProductionBox";

export class Advertising implements IProjectCard {
    public name = CardName.ADVERTISING;
    public cost = 4;
    public tags = [Tags.EARTH];
    public cardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cost >= 20) {
            player.addProduction(Resources.MEGACREDITS);
        }
    }

    public play() {
        return undefined;
    }

    public metadata: CardMetadata = {
        cardNumber: "X14",
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardBonus.megacredits(20), CardSpecial.asterix()],
                    [CardProductionBox.add([[CardBonus.megacredits(1)]])],
                    "When you play a card with a basic cost of 20 MC or more, increase your MC production 1 step"
                ),
            ]),
        ],
    };
}
