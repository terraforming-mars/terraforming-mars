
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SearchForLife implements IActiveProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public scienceResources: number = 0;
    public name: string = "Search For Life";
    public actionText: string = "Spend 1 mega credit to reveal and discard the top of the draw deck. If that card has a microbe tag, add a science resource here.";
    public text: string = "Oxygen must be 6% or less. Gain 3 victory points if you have one or more science resources here";
    public description: string = "Finding native life-forms would be the greatest discovery in history, so let's find out!";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() > 6) {
            return Promise.reject("Oxygen must be 6% or less");
        }
        game.addGameEndListener(() => {
            if (this.scienceResources > 0) {
                player.victoryPoints += 3;
            }
        });
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.megaCredits < 1) {
            return Promise.reject("Must have mega credit");
        }
        player.megaCredits--;
        const topCard = game.dealer.getCards(1)[0];
        if (topCard.tags.indexOf(Tags.MICROBES) !== -1) {
            this.scienceResources++;
        }
        game.dealer.discard(topCard);
        return Promise.resolve();
    }
}
