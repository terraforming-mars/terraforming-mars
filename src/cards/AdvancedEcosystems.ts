import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";

export class AdvancedEcosystems implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES, Tags.ANIMAL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ADVANCED_ECOSYSTEMS;
    public canPlay(player: Player): boolean {
        return player.checkMultipleTagPresence([Tags.PLANT, Tags.ANIMAL, Tags.MICROBES]);
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 3;
    }

    public metadata: CardMetadata = {
        description: "Requires a Plant tag, a Microbe tag, and an Animal tag.",
        cardNumber: "135",
        requirements: new CardRequirements([
            CardRequirement.tag(Tags.PLANT, -1),
            CardRequirement.tag(Tags.MICROBES, -1),
            CardRequirement.tag(Tags.ANIMAL, -1),
        ]),
        victoryPoints: 3,
    };
}
