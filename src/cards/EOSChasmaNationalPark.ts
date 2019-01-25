
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class EOSChasmaNationalPark implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "EOS Chasma National Park";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -12C or warmer. Add 1 animal to any card. Gain 3 plants. Increase your mega credit production 2 steps. Gain 1 victory point.";
    public description: string = "A wonder of the world, doing wonders for the tourism business.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < -12) {
            return Promise.reject("Requires -12C or warmer");
        }
        return new Promise((resolve, reject) => {
            const availableCards = game.getPlayedCardsWithAnimals();
            player.setWaitingFor(new SelectCard(this, "Select card to add animal", availableCards), (options: {[x: string]: string}) => {
                const foundCard = availableCards.filter((card: IProjectCard) => card.name === options.option1)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                if (foundCard.animals === undefined) {
                    reject("Card does not take animals");
                    return;
                }
                foundCard.animals++;
                player.plants += 3;
                player.megaCreditProduction += 2;
                player.victoryPoints++;
                resolve();
            });
        });
    }
}
