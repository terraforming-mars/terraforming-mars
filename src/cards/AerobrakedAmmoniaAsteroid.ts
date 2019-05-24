
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Aerobraked Ammonia Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Add 2 microbes to ANOTHER card. Increase your heat production 3 steps and your plant production 1 step.";
    public description: string = "Ammonia is a greenhouse gas, as well as being a convenient nitrogen source for organisms.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        const cardsToPick = game.getOtherMicrobeCards(this);
        player.heatProduction += 3;
        player.plantProduction++;
        return new SelectCard("Select card to add 2 microbes", cardsToPick, (foundCards: Array<IProjectCard>) => {
            foundCards[0]!.microbes! += 2;
            return undefined;
        });
    }
}

