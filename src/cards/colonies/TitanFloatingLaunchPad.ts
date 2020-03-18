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

export class TitanFloatingLaunchPad implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.TITAN_FLOATER_LAUNCHPAD;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;

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
            player.removeResourceFrom(this, 1);
            game.addInterrupt(new SelectTradeColony(player, game, openColonies, "Select colony to trade with for free")); 
            return undefined;
        });

        opts.push(addResource);

        let openColonies = game.colonies.filter(colony => colony.isActive && colony.visitor === undefined);
        if (openColonies.length > 0 
          && player.fleetSize > player.tradesThisTurn && player.getResourcesOnCard(this) > 0 ){
            opts.push(spendResource);
        }

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