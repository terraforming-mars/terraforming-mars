
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class DevelopmentCenter implements IActionCard, IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: string = "Development Center";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 1 energy to draw a card.";
    public text: string = "";
    public description: string = "Ensuring a constant influx of ideas.";
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy > 0;
    }
    public action(player: Player, game: Game) {
        player.energy--;
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
