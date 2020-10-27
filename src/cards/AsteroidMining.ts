import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardProductionBox } from "./CardProductionBox";

export class AsteroidMining implements IProjectCard {
    public cost: number = 30;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ASTEROID_MINING;

    public play(player: Player) {
        player.addProduction(Resources.TITANIUM, 2);
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
    public metadata: CardMetadata = {
        description:
            "Increase your titanium production 2 steps.",
        cardNumber: "040",
        onPlay: [
            CardRow.add([
                CardProductionBox.add([
                    [CardBonus.titanium(2)]
                ])
            ]),
        ],
        victoryPoints: 2
    };
}
