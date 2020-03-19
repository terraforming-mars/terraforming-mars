import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { IProjectCard } from '../IProjectCard';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { CardName } from '../../CardName';


export class Recyclon implements CorporationCard {
    public name: CardName = CardName.RECYCLON;
    public tags: Array<Tags> = [Tags.MICROBES, Tags.STEEL];
    public startingMegaCredits: number = 38;
    public resourceType: ResourceType = ResourceType.MICROBE;

    public play(player: Player) {
        player.setProduction(Resources.STEEL);
        player.addResourceTo(this);
        return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.STEEL) === -1 || !player.isCorporation(this.name)) {return undefined;}
        if (player.getResourcesOnCard(this) < 2) {
            player.addResourceTo(this);
            return undefined;
        }

        const addResource = new SelectOption("Add a microbe resource to this card", () => {
            player.addResourceTo(this);
            return undefined;
        });

        const spendResource = new SelectOption("Remove 2 microbes on this card and increase plant production 1 step", () => {
            player.removeResourceFrom(this, 2);
            player.setProduction(Resources.PLANTS);
            return undefined;
        });
        return new OrOptions(addResource, spendResource);
    }
}