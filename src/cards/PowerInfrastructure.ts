
import { CardType } from "./CardType";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { IUserData } from "../IUserData";

export class PowerInfrastructure implements IActiveProjectCard {
    public name: string = "Power Infrastructure";
    public text: string = "Action: Spend any amount of energy to gain that amount of mega credits.";
    public description: string = "Efficiency through flexibility."
    public cardType: CardType = CardType.ACTIVE;
    public cost: number = 4;
    public needsUserData: IUserData = {
        energy: "Amount of energy to transfer"
    };
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public play(player: Player, game: Game): void {
        // Nothing happens when played
    }

    public action(player: Player, game: Game, userData: IUserData): void {
        if (player.energy === 0) {
            throw "Have no energy to spend";
        }
        if (parseInt(userData.energy) > player.energy) {
            throw "You don't have that much energy";
        }
        player.energy -= parseInt(userData.energy);
        player.megaCredits += parseInt(userData.energy);
    }

}
