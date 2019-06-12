
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";

export class SecurityFleet implements IActionCard, IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Security Fleet";
    public fighterResources: number = 0;
    public actionText: string = "Spend 1 titanium to add 1 fighter resource to this card.";
    public text: string = "Gain 1 victory point for each fighter resource on this card.";
    public description: string = "Keeping the peace by force.";
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += this.fighterResources;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.titanium > 0;
    }
    public action(player: Player) {
        player.titanium--;
        this.fighterResources++;
        return undefined;
    }
}
