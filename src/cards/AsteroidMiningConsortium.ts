import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";
import { CardSpecial } from "../cards/CardSpecial";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

export class AsteroidMiningConsortium implements IProjectCard {
    public cost = 13;
    public tags = [Tags.JOVIAN];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ASTEROID_MINING_CONSORTIUM;

    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.TITANIUM) >= 1;
    }
    public play(player: Player, game: Game) {
        game.defer(new DecreaseAnyProduction(player, game, Resources.TITANIUM, 1));
        player.addProduction(Resources.TITANIUM);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
    public metadata: CardMetadata = {
        description:
            "Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.",
        cardNumber: "002",
        requirements: new CardRequirements([
            CardRequirement.production(Resources.TITANIUM, -1)
        ]),
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.titanium(-1).any()],
                    [CardSpecial.plus(), CardBonus.titanium(1)]
                ])
            ]),
        ],
    };
}
