import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";
import { CardSpecial } from "../cards/CardSpecial";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class PowerSupplyConsortium implements IProjectCard {
    public cost = 5;
    public tags = [Tags.ENERGY];
    public name = CardName.POWER_SUPPLY_CONSORTIUM;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.ENERGY) >= 2;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY);
        game.defer(new DecreaseAnyProduction(player, game, Resources.ENERGY, 1));
        return undefined;
    }
    public metadata: CardMetadata = {
        description:
            "Requires 2 Power tags. Decrease any Energy production 1 step and increase your own 1 step.",
        cardNumber: "160",
        requirements: new CardRequirements([
            CardRequirement.tag(Tags.ENERGY, 2)
        ]),
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.energy(-1).any()],
                    [CardSpecial.plus(), CardBonus.energy(1)]
                ])
            ]),
        ],
    };
}
