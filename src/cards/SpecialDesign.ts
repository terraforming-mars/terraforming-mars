
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Inventrix } from "./corporation/Inventrix";
import { AdaptationTechnology } from "./AdaptationTechnology";

export class SpecialDesign implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Special Design";
    public text: string = "The next card you play this generation is +2 or -2 in global requirements, your choice.";
    public description: string = "If it isn't feasible, then make it so.";
    public canPlay(): boolean {
        return true;
    }
    private removeBonus(player: Player): void {
        const adaptationTechnology = new AdaptationTechnology().name;
        if (player.corporationCard && player.corporationCard.name === new Inventrix().name) {
            player.requirementsBonus = 2;
        } else if (player.playedCards.find((card) => card.name === adaptationTechnology) !== undefined) {
            player.requirementsBonus = 2;
        } else {
            player.requirementsBonus = 0;
        }
    }
    public play(player: Player, game: Game) {
        player.requirementsBonus = 2;
        const remove = () => {
            this.removeBonus(player);
            player.removeCardPlayedHandler(handler);
            game.removeGenerationEndListener(onGenerationEnd);
        };
        const handler = (card: IProjectCard) => {
            // Skip this card being played
            if (card.name !== this.name) {
                remove();
            }
        };
        const onGenerationEnd = () => {
            remove();
        };
        player.addCardPlayedHandler(handler);
        game.addGenerationEndListener(onGenerationEnd);
        return undefined;
    }
}
