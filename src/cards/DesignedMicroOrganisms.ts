
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class DesignedMicroOrganisms implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Designed Micro-organisms";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "It must be -14C or colder. Increase your plant production 2 steps";
    public description: string = "Specializing in extremely cold conditions";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.temperature > -14) {
                reject("It must be -14C or colder");
                return;
            }
            player.plantProduction += 2;
            resolve();
        });
    }
}
