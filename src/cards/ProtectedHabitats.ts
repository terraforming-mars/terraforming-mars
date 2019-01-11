
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class ProtectedHabitats implements IProjectCard {
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 5;
    public tags: Array<Tags> = [];
    public name: string = "Protected Habitats";
    public text: string = "OPPONENTS MAY NOT REMOVE YOUR plant, animal, or microbes";
    public description: string = "The harsh environment is not the only threat to your ecological projects";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.opponentsCanRemovePlants = false;
            player.opponentsCanRemoveAnimals = false;
            player.opponentsCanRemoveMicrobes = false; 
            resolve();
        });
    }
}
