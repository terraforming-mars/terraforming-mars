import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardSpecial } from "./CardSpecial";
import { CardBonus } from "./CardBonus";
import { CardEffect } from "./CauseAndEffect";

export class AdvancedAlloys implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE];
    public name = CardName.ADVANCED_ALLOYS;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
        player.increaseTitaniumValue();
        player.steelValue++;
        return undefined;
    }

    public metadata: CardMetadata = {
        cardNumber: "071",
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardBonus.titanium(1)],
                    [CardSpecial.plus().small(), CardBonus.megacredits(1)],
                    "Each titanium you have is worth 1 MC extra"
                ),
            ]),
            CardRow.add([
                CardEffect.add(
                    [CardBonus.steel(1)],
                    [CardSpecial.plus().small(), CardBonus.megacredits(1)],
                    "Each steel you have is worth 1 MC extra"
                ),
            ]),
        ],
    };
}
