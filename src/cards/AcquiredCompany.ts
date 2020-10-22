import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRow } from "../cards/CardRow";
import { CardBonus } from "../cards/CardBonus";
import { CardProductionBox } from "../cards/CardProductionBox"; 

export class AcquiredCompany implements IProjectCard {
    public cost = 10;
    public tags = [Tags.EARTH];
    public name = CardName.ACQUIRED_COMPANY;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, 3);
        return undefined;
    }

    public metadata: CardMetadata = {
        description:
            "Increase your MC production 3 steps.",
        cardNumber: "106",
        onPlay: [
            CardRow.add([
              CardProductionBox.add([
                [CardBonus.megacredits(3)]
              ])
            ]),
        ],
    };
}
