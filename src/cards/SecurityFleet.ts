
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SecurityFleet implements IProjectCard {
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
    public play(player: Player, game: Game) {
        game.addGameEndListener(() => {
            player.victoryPoints += this.fighterResources;
        });
        return undefined;
    }
    public action(player: Player, _game: Game) {
        if (player.titanium < 1) {
            throw "Need titanium";
        }
        player.titanium--;
        this.fighterResources++;
        return undefined;
    }
}
