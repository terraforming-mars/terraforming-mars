import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class Donation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.DONATION;
    public bonusMc: number = 21;

    public play(player: Player) {     
        player.megaCredits += this.bonusMc;
        return undefined;
    }
}

