
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ViralEnhancers implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Viral Enhancers";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "When you play a plant, microbe, or an animal tag, including this, gain 1 plant or add 1 resource to that card.";
    public description: string = "Genetically engineered virus strains can be used to introduce favorable genes to other organisms.";
    public play(player: Player, game: Game): Promise<void> {
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.ANIMAL) !== -1 || card.tags.indexOf(Tags.PLANT) !== -1 || card.tags.indexOf(Tags.MICROBES) !== -1) {
                if (player.cardHasResource(card)) {
                    player.addResourceTo(card);
                } else {
                    player.plants++;
                }
            }
        });
        return Promise.resolve();
    }
}
