import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirements } from "../../cards/CardRequirements";

export class LuxuryFoods implements IProjectCard {
    public cost = 8;
    public tags = [];
    public name = CardName.LUXURY_FOODS;
    public cardType = CardType.AUTOMATED;

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
        description: "Requires that you have a Venus tag, an Earth tag and a Jovian tag.",
        cardNumber: "T10",
        requirements: CardRequirements.builder((b) =>
            b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)
        ),
        victoryPoints: 2,
    };
}
