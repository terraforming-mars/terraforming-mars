import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { CardName } from "../../CardName";
import { IResourceCard } from "../ICard";
import { CardType } from "../CardType";

export class Pristar implements CorporationCard, IResourceCard {
    public name = CardName.PRISTAR;
    public tags = [];
    public startingMegaCredits: number = 53;
    public resourceType = ResourceType.PRESERVATION;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
        player.decreaseTerraformRatingSteps(2);
        return undefined;
    }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount);
    }

    public onProductionPhase(player: Player) {
        if (!(player.hasIncreasedTerraformRatingThisGeneration)) {
            player.megaCredits += 6;
            this.resourceCount++;
        }
        return undefined;
    }
}
