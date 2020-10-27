
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";
import { CardMetadata } from "./CardMetadata";
import { CardProductionBox } from "./CardProductionBox";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";

export class Lichen implements IProjectCard {
    public cost = 7;
    public tags = [Tags.PLANT];
    public name = CardName.LICHEN;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -24 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
    public metadata: CardMetadata = {
        description: "Requires -24 C or warmer. Increase your Plant production 1 step.",
        cardNumber: "159",
        requirements: new CardRequirements([CardRequirement.temperature(-24)]),
        onPlay: [CardRow.add([
            CardProductionBox.add([
                [CardBonus.plants(1)],
            ]),
        ])],
    };
}

