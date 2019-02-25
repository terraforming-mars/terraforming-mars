
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Research implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SCIENCE];
    public name: string = "Research";
    public cardType: CardType = CardType.AUTOMATED;
    // TODO - How would this impact the game? Not sure what to do here. Seems
    // a few other cards would let you shuffle your deck a lot.
    public text: string = "Counts as playing 2 science cards. Draw 2 cards. Gain 1 victory point.";
    public description: string = "Through technical excellence you will unlock many wondrous things";
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        return undefined;
    }
}
