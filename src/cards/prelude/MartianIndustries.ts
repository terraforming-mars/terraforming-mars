import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MARTIAN_INDUSTRIES;
    public bonusMc: number = 6;

    public play(player: Player) {
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.STEEL);
        player.megaCredits += this.bonusMc;
        return undefined;
    }
}

