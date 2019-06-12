
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";

export class SearchForLife implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public scienceResources: number = 0;
    public name: string = "Search For Life";
    public actionText: string = "Spend 1 mega credit to reveal and discard the top of the draw deck. If that card has a microbe tag, add a science resource here.";
    public text: string = "Oxygen must be 6% or less. Gain 3 victory points if you have one or more science resources here";
    public description: string = "Finding native life-forms would be the greatest discovery in history, so let's find out!";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 6 + player.getRequirementsBonus(game);
    }
    public onGameEnd(player: Player) {
        if (this.scienceResources > 0) {
            player.victoryPoints += 3;
        }
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(1);
    }
    public action(player: Player, game: Game) {
        const doAction = () => {
            const topCard = game.dealer.dealCard();
            if (topCard.tags.indexOf(Tags.MICROBES) !== -1) {
                this.scienceResources++;
            }
            game.dealer.discard(topCard);
            return undefined;
        };
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay("Select how to pay for action", false, false, true, (htp) => {
                if (htp.heat + htp.megaCredits < 1) {
                    throw "Need to spend at least one";
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                return doAction();
            });
        }
        player.megaCredits--;
        return doAction();
    }
}
