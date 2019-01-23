
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class OptimalAerobraking implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Optimal Aerobraking";
    public text: string = "When you play a space event, you gain 3 mega credit and 3 heat.";
    public description: string = "Perfecting the art of ballistic and material analysis can increase efficiency and save money.";
    public play(player: Player, game: Game): Promise<void> {
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.cardType === CardType.EVENT && card.tags.indexOf(Tags.SPACE) !== -1) {
                player.megaCredits += 3;
                player.heat += 3;
            }
        });
        return Promise.resolve();
    }
}
