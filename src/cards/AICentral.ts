import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { IActionCard } from "./ICard";

export class AICentral implements IActionCard, IProjectCard {
    public cost: number = 21;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "AI Central";
    public actionText: string = "Draw 2 cards";
    public text: string = "Requires 3 science tags to play. Decrease your energy production 1 step. Gain 1 victory point.";
    public requirements: string = "3 Science";
    public description: string = "\"42\"";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3 && player.energyProduction >= 1;
    }
    public play(player: Player, _game: Game) {
        player.energyProduction--;
        player.victoryPoints++;
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard()
        );
        return undefined;
    }
}