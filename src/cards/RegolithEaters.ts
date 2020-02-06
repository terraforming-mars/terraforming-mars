
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";

export class RegolithEaters implements IActionCard, IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Regolith Eaters";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (player.getResourcesOnCard(this) < 2) {
            player.addResourceTo(this);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Add 1 microbe to this card", () => {
                player.addResourceTo(this);
                return undefined;
            }),
            new SelectOption("Remove 2 microbes to raise oxygen level 1 step", () => {
                player.removeResourceFrom(this, 2);
                return game.increaseOxygenLevel(player, 1);
            })
        );
    }
}
