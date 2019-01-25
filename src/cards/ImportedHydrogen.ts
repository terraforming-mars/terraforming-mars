
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ImportedHydrogen implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Hydrogen";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Gain 3 plants, or add 3 microbes or 2 animals to another card. Place an ocean tile.";
    public description: string = "A light-weight bug expensive crucial element.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor([
                {
                    initiator: "card",
                    type: "SelectAmount",
                    card: this,
                    title: "Gain 3 plants",
                    id: "option1"
                }, {
                    title: "Add 3 microbes or 2 animals to another card",
                    initiator: "card",
                    type: "SelectAmount",
                    card: this,
                    id: "option2",
                    options: [{
                        initiator: "card",
                        card: this,
                        type: "SelectACard",
                        title: "Select a card",
                        id: "option3"
                    }]
                }, {
                    initiator: "card",
                    type: "SelectASpace",
                    card: this,
                    id: "option4"
                }
            ], (options: {[x: string]: string}) => {
                try { game.addOceanTile(player, options.option4); }
                catch (err) { reject(err); return; }
                if (options.option1) {
                    player.plants += 3;
                } else if (options.option2) {
                    const foundCard = game.getCard(options.option3);
                    if (foundCard === undefined) {
                        reject("Card not found");
                        return;
                    }
                    if (foundCard.microbes !== undefined) {
                        foundCard.microbes += 3;
                    } else if (foundCard.animals !== undefined) {
                        foundCard.animals += 2;
                    }
                }
                resolve();
            });
        });
    }
}
