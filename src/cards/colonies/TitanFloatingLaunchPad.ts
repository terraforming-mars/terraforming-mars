import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from '../../Game';
import { SelectTradeColony } from '../../interrupts/SelectTradeColony';
import { IResourceCard } from '../ICard';

export class TitanFloatingLaunchPad implements IProjectCard,IResourceCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.TITAN_FLOATER_LAUNCHPAD;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];
        const addResource = new SelectOption("Add 1 floater to a Jovian card", () => {
            game.addResourceInterrupt(player, ResourceType.FLOATER, 1, undefined, Tags.JOVIAN);
            return undefined;
        });

        const spendResource = new SelectOption("Remove 1 floater on this card to trade for free", () => {
            this.resourceCount--;
            game.addInterrupt(new SelectTradeColony(player, game, openColonies, "Select colony to trade with for free")); 
            return undefined;
        });

        let openColonies = game.colonies.filter(colony => colony.isActive && colony.visitor === undefined);
        if (openColonies.length > 0 
          && player.fleetSize > player.tradesThisTurn && this.resourceCount > 0 ){
            opts.push(spendResource);
        }

        opts.push(addResource);

        return new OrOptions(...opts);
    }

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, this, Tags.JOVIAN);
      return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}