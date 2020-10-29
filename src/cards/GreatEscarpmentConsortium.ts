import { IProjectCard } from "./IProjectCard";
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

export class GreatEscarpmentConsortium implements IProjectCard {
    public cost = 6;
    public tags = [];
    public name = CardName.GREAT_ESCARPMENT_CONSORTIUM;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.STEEL) >= 1;
    }
    public play(player: Player, game: Game) {
        game.defer(new DecreaseAnyProduction(player, game, Resources.STEEL, 1));
        player.addProduction(Resources.STEEL);
        return undefined;
    }
    public metadata: CardMetadata = {
        description:
            "Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.",
        cardNumber: "061",
        requirements: new CardRequirements([
            CardRequirement.production(Resources.STEEL, -1)
        ]),
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.steel(-1).any()],
                    [CardSpecial.plus(), CardBonus.steel(1)]
                ])
            ]),
        ],
    };
}
