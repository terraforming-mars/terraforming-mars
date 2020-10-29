import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardProductionBox } from "./CardProductionBox";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";

export class AdaptedLichen implements IProjectCard {
    public cost = 9;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ADAPTED_LICHEN;
    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
    public metadata: CardMetadata = {
        description: "Increase your Plant production 1 step.",
        cardNumber: "048",
        onPlay: [CardRow.add([
            CardProductionBox.add([
                [CardBonus.plants(1)],
            ]),
        ])],
    };
}
