
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { IProjectCard } from "./IProjectCard";

export class ExtremeColdFungus implements IActiveProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Extreme-Cold Fungus";
    public actionText: string = "Gain 1 plant or add 2 microbes to ANOTHER card.";
    public text: string = "It must be -10C or colder";
    public description: string = "Adapted strains able to form symbiotic relationships with other organisms";
    public play(_player: Player, game: Game): Promise<void> {
        if (game.getTemperature() > -10) {
            return Promise.reject("It must be -10C or colder");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        const otherMicrobeCards = game.getOtherMicrobeCards(this);
        return new Promise((resolve, _reject) => {
            player.setWaitingFor(
                new OrOptions(
                    new SelectOption(this.name, "Gain 1 plant", () => { player.plants++; resolve(); }),
                    new SelectCard(this.name, "Select card to remove 2 microbes", otherMicrobeCards, (foundCards: Array<IProjectCard>) => {
                        foundCards[0]!.microbes! += 2;
                        resolve();
                    })
                )
            );
        });
    }
}
