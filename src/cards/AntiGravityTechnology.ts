import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRow } from "../cards/CardRow";
import { CardSpecial } from "../cards/CardSpecial";
import { CardBonus } from "../cards/CardBonus";
import { CardEffect } from "./CauseAndEffect";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";

export class AntiGravityTechnology implements IProjectCard {
    public cost = 14;
    public tags = [Tags.SCIENCE];
    public name = CardName.ANTI_GRAVITY_TECHNOLOGY;
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 7;
    }
    public getCardDiscount() {
        return 2;
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 3;
    }
    public metadata: CardMetadata = {
        description: "Requires 7 science tags.",
        cardNumber: "150",
        requirements: new CardRequirements([CardRequirement.tag(Tags.SCIENCE, 7)]),
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardSpecial.empty()],
                    [CardBonus.megacredits(-2).inside()],
                    "When you play a card, you pay 2 MC less for it"
                ),
            ]),
        ],
        victoryPoints: 3,
    };
}
