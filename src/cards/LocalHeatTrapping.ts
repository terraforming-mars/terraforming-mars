
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public text: string = "Spend 5 heat to either gain 4 plants, or to add 2 animals to ANOTHER card.";
    public description: string = "Life can benefit from local hot spots";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.heat < 5) {
                reject("Not enough heat");
                return;
            }
            const otherAnimalCards: Array<IProjectCard> = game.getOtherAnimalCards(this);
            player.setWaitingFor(
                new OrOptions(
                    new SelectOption(this, "Gain 4 plants", () => {
                        player.plants += 4;
                        player.heat -= 5;
                        resolve();
                    }),
                    new SelectCard(this, "Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                        try {
                            player.addAnimalsToCard(foundCards[0], 2);
                        } catch (err) { reject(err); return; }
                        player.heat -= 5;
                        resolve();
                    })
                )
            );
        });
    }
}
