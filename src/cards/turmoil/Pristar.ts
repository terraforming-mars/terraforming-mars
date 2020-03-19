import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { CardName } from '../../CardName';

export class Pristar implements CorporationCard {
    public name: CardName = CardName.PRISTAR;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 53;
    public resourceType: ResourceType = ResourceType.PRESERVATION;
    private lastGenerationTR: number = 0;

    public play(player: Player) {
        player.terraformRating -= 2;
        this.lastGenerationTR = player.terraformRating;
        return undefined;
    }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this));
    }

    public onProductionPhase(player: Player) {
        if (this.lastGenerationTR >= player.terraformRating) {
            player.megaCredits += 6;
            player.addResourceTo(this);
        }
        this.lastGenerationTR = player.terraformRating;
        return undefined;
    }
}