
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { SelectCard } from "../inputs/SelectCard";

export class CEOsFavoriteProject implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "CEO's Favorite Project";
    public text: string = "ADD 1 RESOURCE TO A CARD WITH AT LEAST 1 RESOURCE ON IT";
    public description: string = "Having the top man's attention, the involved people are sure to do their best";
    public play(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const availableCards = player.getCardsWithResources().filter((card) => card.animals || card.microbes || card.fighterResources || card.scienceResources);
            player.setWaitingFor(new SelectCard(this, "Select card to add resource", availableCards, (foundCards: Array<IProjectCard>) => {
                const foundCard = foundCards[0];
                if (foundCard.animals) {
                    foundCard.animals++;
                } else if (foundCard.microbes) {
                    foundCard.microbes++;
                } else if (foundCard.fighterResources) {
                    foundCard.fighterResources++;
                } else {
                    reject("Unsupported resource");
                    return;
                }
                resolve();
            }));
        });
    }
}

