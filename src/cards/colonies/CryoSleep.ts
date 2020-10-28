import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardBonus } from "../../cards/CardBonus";
import { CardEffect } from "../../cards/CardEffect";

export class CryoSleep implements IProjectCard {
    public cost = 10;
    public tags = [Tags.SCIENCE];
    public name = CardName.CRYO_SLEEP;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeDiscount++;
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
    public metadata: CardMetadata = {
        cardNumber: "C07",
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardBonus.trade()],
                    [CardBonus.tradeDiscount(1)],
                    "When you trade, you pay 1 less resource for it"
                ),
            ]),
        ],
        victoryPoints: 1,
    };
}
