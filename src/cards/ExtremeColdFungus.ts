
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ExtremeColdFungus implements IActiveProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Extreme-Cold Fungus";
    public actionText: string = "Gain 1 plant or add 2 microbes to ANOTHER card.";
    public text: string = "It must be -10C or colder";
    public description: string = "Adapted strains able to form symbiotic relationships with other organisms";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() > -10) {
            return Promise.reject("It must be -10C or colder");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        const availableCards = player.playedCards.filter((card) => {
            return card.name !== this.name && card.microbes >= 0;
        });
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "OptionOrCard",
                message: "Gain 1 plant or add 2 microbes to ANOTHER card.",
                cards: availableCards
            }, (option: string) => {
                if (option === "0") {
                    player.plants++;
                    resolve();
                } else {
                    const foundCard = availableCards.filter((card) => card.name === option)[0];
                    if (foundCard === undefined) {
                        reject("Card not found");
                    } else {
                        foundCard.microbes += 2;
                        resolve();
                    }
                }
            });
        });
    }
}
