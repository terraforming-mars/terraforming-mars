import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";

export class TitanAirScrapping implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: string = CardName.TITAN_AIRSCRAPPING;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;

    public canAct(player: Player): boolean {
        return player.titanium > 0  || player.getResourcesOnCard(this) >= 2;
    }

    public action(player: Player) {
        var opts: Array<SelectOption> = [];
        const addResource = new SelectOption("Spend 1 titanium to add 2 floaters on this card", () => {
            player.addResourceTo(this, 2);
            player.titanium--;
            return undefined;
        });

        const spendResource = new SelectOption("Remove 2 floaters on this card to increase your TR 1 step", () => {
            player.removeResourceFrom(this, 2);
            player.terraformRating++;
            return undefined;
        });

        if (player.getResourcesOnCard(this) >= 2 && player.titanium > 0) {
            opts.push(addResource);
            opts.push(spendResource);
        } else if (player.titanium > 0) {
            return addResource;
        } else {
            return spendResource;
        }

        return new OrOptions(...opts);
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 2;
    }
}