import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Resources } from "../../Resources";

export class LocalShading implements IActionCard,IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = "Local Shading";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;

    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }    
    public action(player: Player) {
        var opts: Array<SelectOption> = [];
        const addResource = new SelectOption("Add 1 floater to this card", () => {
            player.addResourceTo(this);
            return undefined;
        });

        const spendResource = new SelectOption("Remove 1 floater to increase MC production 1 step", () => {
            player.removeResourceFrom(this);
            player.setProduction(Resources.MEGACREDITS);
            return undefined;
        });

        opts.push(addResource);

        if (player.getResourcesOnCard(this) > 0) {
            opts.push(spendResource);
        } else return addResource;

        return new OrOptions(...opts);
    }
}