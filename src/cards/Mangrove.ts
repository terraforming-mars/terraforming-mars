
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceType } from "../SpaceType";
import { ISpace } from "../ISpace";

export class Mangrove implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Mangrove";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires +4C or warmer. Place a greenery tile on an area reserved for ocean and raise oxygen 1 step. Disregard normal placement restrictions for this. Gain 1 victory point.";
    public description: string = "A wetland forest will create an ecosystem where new species can thrive.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 4 - (2 * player.requirementsBonus);
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        return new SelectSpace(this.name, "Select ocean space for greenery", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
        });
    }
}
