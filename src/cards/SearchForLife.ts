
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SearchForLife implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public scienceResources: number = 0;
    public name: string = "Search For Life";
    public actionText: string = "Spend 1 mega credit to reveal and discard the top of the draw deck. If that card has a microbe tag, add a science resource here.";
    public text: string = "Oxygen must be 6% or less. Gain 3 victory points if you have one or more science resources here";
    public description: string = "Finding native life-forms would be the greatest discovery in history, so let's find out!";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 6;
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() > 6) {
            throw "Oxygen must be 6% or less";
        }
        game.addGameEndListener(() => {
            if (this.scienceResources > 0) {
                player.victoryPoints += 3;
            }
        });
        return undefined;
    }
    public action(player: Player, game: Game) {
        if (player.megaCredits < 1) {
            throw "Must have mega credit";
        }
        player.megaCredits--;
        const topCard = game.dealer.dealCard();
        if (topCard.tags.indexOf(Tags.MICROBES) !== -1) {
            this.scienceResources++;
        }
        game.dealer.discard(topCard);
        return undefined;
    }
}
