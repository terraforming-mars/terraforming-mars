
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectCard } from "../inputs/SelectCard";

export class ImportedNitrogen implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Nitrogen";
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
        return true;
    }
    private giveResources(player: Player): undefined {
        player.terraformRating++;
        player.plants += 4;
        return undefined;
    }
    public play(player: Player, game: Game) {
        const otherAnimalCards = game.getOtherAnimalCards(this);
        const otherMicrobeCards = game.getOtherMicrobeCards(this);

        if (otherAnimalCards.length === 0 && otherMicrobeCards.length === 0) {
            return this.giveResources(player);
        } else if (otherAnimalCards.length > 0 && otherMicrobeCards.length > 0) {
            return new AndOptions(
                () => this.giveResources(player),
                new SelectCard("Select card to add 3 microbes", otherMicrobeCards, (foundCards: Array<IProjectCard>) => {
                    player.addResourceTo(foundCards[0], 3);
                    return undefined;
                }),
                new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    return undefined;
                })
            );
        } else if (otherAnimalCards.length > 0) {
            return new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 2);
                return this.giveResources(player);
            });
        }
        return new SelectCard("Select card to add 3 microbes", otherMicrobeCards, (foundCards: Array<IProjectCard>) => {
            player.addResourceTo(foundCards[0], 3);
            return this.giveResources(player);
        });
    }
}
