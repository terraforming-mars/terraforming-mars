import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardBonus } from "../../cards/CardBonus";
import { CardProductionBox } from "../CardProductionBox";

export class SocietySupport extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.SOCIETY_SUPPORT;
    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, -1);
        player.addProduction(Resources.PLANTS);
        player.addProduction(Resources.ENERGY);
        player.addProduction(Resources.HEAT);
        return undefined;
    }

    public metadata: CardMetadata = {
        description:
            "Increase your plant, energy and heat production 1 step. Decrease money production 1 step.",
        cardNumber: "P31",
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.megacredits(-1), CardBonus.plants(1)],
                    [CardBonus.energy(1), CardBonus.heat(1)],
                ]),
            ]),
        ],
    };
}
