import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class ValuableGases extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.VENUS];
    public name: CardName = CardName.VALUABLE_GASES;

    public play(player: Player) {     
        player.megaCredits += 10;
        return undefined;
    }
}

