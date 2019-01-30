
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class PhysicsComplex implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: string = "Physics Complex";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 6 energy to add a science resource to this card.";
    public text: string = "Gain 2 victory points for each science resource on this card.";
    public description: string = "This used to cause blackouts before the invention of supercomputers.";
    public scienceResources: number = 0;
    public play(player: Player, game: Game): Promise<void> {
        game.addGameEndListener(() => {
            player.victoryPoints += 2 * this.scienceResources;
        });
        return Promise.resolve();
    }
    public action(player: Player, _game: Game): Promise<void> {
        if (player.energy < 6) {
            return Promise.reject("Requires 6 energy");
        }
        player.energy -= 6;
        this.scienceResources++;
        return Promise.resolve();
    }
}
