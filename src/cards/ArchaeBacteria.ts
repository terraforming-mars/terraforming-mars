import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

export class ArchaeBacteria implements IProjectCard {
    public cost = 6;
    public tags = [Tags.MICROBES];
    public name = CardName.ARCHAEBACTERIA;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -18 + player.getRequirementsBonus(game) * 2;
    }
    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
    public metadata: CardMetadata = {
        description:
            "It must be -18 C or colder. Increase your Plant production 1 step.",
        cardNumber: "042",
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.plants(1)]
                ])
            ]),
        ],
    };
}
