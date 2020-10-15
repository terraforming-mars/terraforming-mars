import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirements } from "../../cards/CardRequirements";
import { CardRequirement } from "../../cards/CardRequirement";

export class LuxuryFoods implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LUXURY_FOODS;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    }

    public play() {
        return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }

    public metadata: CardMetadata = {
        description: "Requires that you have a Varth tag, an Earth tag and a Jovian tag.",
        cardNumber: "T10",
        requirements: new CardRequirements([
            CardRequirement.tag(Tags.VENUS, -1),
            CardRequirement.tag(Tags.EARTH, -1),
            CardRequirement.tag(Tags.JOVIAN, -1),
        ]),
        victoryPoints: 2,
    };
}
