import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { CardMetadata } from "../CardMetadata";
import { CardRequirements } from "../CardRequirements";
import { CardRequirement } from "../CardRequirement";
import { CardRow } from "../CardRow";
import { CardBonus } from "../CardBonus";
import { CardSpecial } from "../CardSpecial";
import { CardProductionBox } from "../CardProductionBox";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class Airliners implements IProjectCard {
    public cost = 11;
    public tags = [];
    public name = CardName.AIRLINERS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getResourceCount(ResourceType.FLOATER) >= 3;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.MEGACREDITS, 2);
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2));
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
    public metadata: CardMetadata = {
        description:
            "Requires that you have 3 floaters. Increase your MC production 2 steps. Add 2 floaters to ANY card.",
        cardNumber: "C01",
        requirements: new CardRequirements([CardRequirement.floaters(3)]),
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.megacredits(2)]
                ])
            ]),
            CardRow.add([
                CardBonus.floaters(2), CardSpecial.asterix()
            ])
        ],
        victoryPoints: 1,
    };
}
