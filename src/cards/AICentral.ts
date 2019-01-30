
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AICentral implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "AI Central";
    public actionText: string = "Draw 2 cards";
    public text: string = "Requires 3 science tags to play. Decrease your energy production 1 step. Gain 1 victory point.";
    public description: string = "\"42\"";
    public play(player: Player, _game: Game): Promise<void> {
        if (player.getTagCount(Tags.SCIENCE) < 3) {
            return Promise.reject("Requires 3 science tags");
        }
        player.energyProduction--;
        player.victoryPoints++;
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        return Promise.resolve();
    }
}
