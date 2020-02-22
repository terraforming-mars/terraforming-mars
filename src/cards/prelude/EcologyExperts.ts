import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class EcologyExperts extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES];
    public name: string = CardName.ECOLOGY_EXPERTS;
    public getRequirementBonus(player: Player): number {
        const lastCardPlayed = player.getLastCardPlayedThisTurn();
        if (lastCardPlayed !== undefined && lastCardPlayed.name === this.name) {
            // Magic number high enough to always ignore requirements.
            return 50;
        }
        return 0;
    }
    public play(player: Player) {
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}

