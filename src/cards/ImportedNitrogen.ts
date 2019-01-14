
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ImportedNitrogen implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Nitrogen";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise your terraform rating 1 step and gain 4 plants. Add 3 microbes to ANOTHER card and 2 animals to ANOTHER card.";
    public description: string = "Providing nitrogen needed in the atmosphere and for biomass.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const availableCards = player.getActiveAndAutomatedCards(); 
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectACardForFree",
                message: "Select card to add 3 microbes",
                cards: availableCards
            }, (cardName: string) => {
                const foundCard1 = availableCards.filter((f) => f.name === cardName)[0];
                if (foundCard1 === undefined) {
                    reject("Card not found");
                    return;
                }
                player.setWaitingFor(undefined);
                player.setWaitingFor({
                    initiator: "card",
                    card: this,
                    type: "SelectACardForFree",
                    message: "Select card to add 2 animals",
                    cards: availableCards
                }, (cardName2: string) => {
                    const foundCard2 = availableCards.filter((f) => f.name === cardName2)[0];
                    if (foundCard2 === undefined) {
                        reject("Card not found");
                        return;
                    }
                    foundCard1.microbes += 3;
                    foundCard2.animals += 2;
                    player.terraformRating++;
                    player.plants += 4;
                    resolve();
                });
            });
        });
    }
}
