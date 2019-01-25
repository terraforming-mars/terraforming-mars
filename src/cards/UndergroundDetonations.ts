
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class UndergroundDetonations implements IActiveProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Underground Detonations";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 10 mega credit to increase your heat production 2 steps.";
    public description: string = "Radiation from the nuclear blast is shielded, but over time, we are still getting the heat.";
    public text: string = "";
    public action(player: Player, _game: Game): Promise<void> {
        if (player.megaCredits < 10) {
            return Promise.reject("Must have 10 mega credits to spend");
        }
        player.megaCredits -= 10;
        player.heatProduction += 2;
        return Promise.resolve();
    }
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
}
