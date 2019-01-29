
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
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < 4) {
            return Promise.reject("Requires +4C or warmer");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select ocean space for greenery", (foundSpace: ISpace) => {
                if (foundSpace.spaceType !== SpaceType.OCEAN) {
                    reject("Space not an ocean");
                    return undefined;
                }
                return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN).then(function () {
                    player.victoryPoints++;
                    resolve();
                });
            }));
        });
    }
}
