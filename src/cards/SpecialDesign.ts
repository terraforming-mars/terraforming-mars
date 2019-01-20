
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class SpecialDesign implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Special Design";
    public text: string = "The next card you play this generation is +2 or -2 in global requirements, your choice.";
    public description: string = "If it isn't feasible, then make it so.";
    public play(player: Player, game: Game): Promise<void> {
        const startingBonus = player.requirementsBonus;
        player.requirementsBonus = 2;
        const handler = (card: IProjectCard) => {
            // Skip this card being played
            if (card.name !== this.name) {
                player.requirementsBonus = startingBonus;
                player.removeCardPlayedHandler(handler);
            }
        };
        player.addCardPlayedHandler(handler);
        return Promise.resolve();
    }
}
