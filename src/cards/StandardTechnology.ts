
import { StandardProjectType } from "../StandardProjectType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { CardName } from '../CardName';

export class StandardTechnology implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.STANDARD_TECHNOLOGY;
    public cardType: CardType = CardType.ACTIVE;

    public onStandardProject(player: Player, projectType: StandardProjectType) { 
        if (projectType !== StandardProjectType.SELLING_PATENTS) {
            player.megaCredits += 3;
        }
    }
    public play() {
        return undefined;
    }
}
