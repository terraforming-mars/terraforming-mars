
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from '../CardName';

export class NitriteReducingBacteria implements IActionCard, IProjectCard {
    public cost: number = 11;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.NITRITE_REDUCING_BACTERIA;

    public play(player: Player) {
        player.addResourceTo(this, 3);
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player) {
        if (player.getResourcesOnCard(this) < 3) {
            player.addResourceTo(this);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Add 1 microbe to this card", () => {
                player.addResourceTo(this);
                return undefined;
            }),
            new SelectOption("Remove 3 microbes to increase your terraform rating 1 step", () => {
                player.removeResourceFrom(this, 3);
                player.terraformRating++;
                return undefined;
            })
        );
    }
}
