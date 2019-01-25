
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Aerobraked Ammonia Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Add 2 microbes to ANOTHER card. Increase your heat production 3 steps and your plant production 1 step.";
    public description: string = "Ammonia is a greenhouse gas, as well as being a convenient nitrogen source for organisms.";
    public play(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const cardsToPick = player.playedCards.filter((card) => card.microbes !== undefined);
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectACard",
                cards: cardsToPick
            }, (cardName: string) => {
                if (cardName === this.name) {
                    reject("Must select ANOTHER card");
                    return;
                }
                const foundCard = cardsToPick.filter((card) => card.name === cardName)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                if (foundCard.microbes === undefined) {
                    reject("Card does not take microbes");
                    return;
                }
                foundCard.microbes += 2;
                player.heatProduction += 3;
                player.plantProduction++;
                resolve();
                return;
            });
        });
    }
}

