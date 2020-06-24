import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from '../../Game';
import { SelectAmount } from "../../inputs/SelectAmount";
import { IResourceCard } from '../ICard';


export class TitanShuttles implements IProjectCard, IResourceCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.TITAN_SHUTTLES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        var opts: Array<SelectOption | SelectAmount> = [];
        const addResource = new SelectOption("Add 2 floaters to a Jovian card", () => {
            game.addResourceInterrupt(player, ResourceType.FLOATER, 2, undefined, Tags.JOVIAN);
            return undefined;
        });

        const spendResource = new SelectAmount("Remove X floaters on this card to gain X titanium", (amount: number) => {
            player.removeResourceFrom(this, amount);
            player.titanium += amount; 
            return undefined;
        }, this.resourceCount);

        if (this.resourceCount > 0){
            opts.push(spendResource);
        }

        opts.push(addResource);

        return new OrOptions(...opts);
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}