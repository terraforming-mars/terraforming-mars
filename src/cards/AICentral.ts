
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
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 3) {
            throw "Requires 3 science tags";
        }
        if (player.energyProduction < 1) {
            throw "Requires energy production";
        }
        player.energyProduction--;
        player.victoryPoints++;
        return undefined;
    }
    public action(player: Player, game: Game) {
        player.cardsInHand.push.apply(player.cardsInHand, game.dealer.getCards(2));
        return undefined;
    }
}
