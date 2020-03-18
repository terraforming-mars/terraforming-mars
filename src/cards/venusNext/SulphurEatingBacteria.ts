import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';
import { SelectAmount } from '../../inputs/SelectAmount';
import { CardName } from '../../CardName';

export class SulphurEatingBacteria implements IActionCard,IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.VENUS, Tags.MICROBES];
    public name: string = CardName.SULPHUR_EATING_BACTERIA;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 6 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }    
    public action(player: Player) {
        var opts: Array<SelectOption | SelectAmount> = [];
        const addResource = new SelectOption("Add 1 microbe to this card", () => {
            player.addResourceTo(this);
            return undefined;
        });

        const spendResource = new SelectAmount("Remove any number of microbes to gain 3 MC per microbe removed", (amount: number) => {
            player.removeResourceFrom(this,amount);
            player.megaCredits += 3 * amount;
            return undefined;
        }, player.getResourcesOnCard(this));
        opts.push(addResource);

        if (player.getResourcesOnCard(this) > 0) {
            opts.push(spendResource);
        } else return addResource;

        return new OrOptions(...opts);
    }
}