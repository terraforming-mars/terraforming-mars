
import { StandardProjectType } from "../StandardProjectType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class StandardTechnology implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Standard Technology";
    public cardType: CardType = CardType.ACTIVE;
    public description: string = "Standard solutions honed to perfection";
    public text: string = "After you pay for a standard project, except selling patents, you gain 3 mega credits";
    public play(player: Player, _game: Game) {
        player.addStandardProjectHandler((project: StandardProjectType) => {
            if (project !== StandardProjectType.SELLING_PATENTS) {
                player.megaCredits += 3;
            }
        });
        return undefined;
    }
}
