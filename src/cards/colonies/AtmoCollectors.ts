import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { IResourceCard } from '../ICard';
import { LogHelper } from "../../components/LogHelper";
import { Resources } from "../../Resources";

export class AtmoCollectors implements IProjectCard, IResourceCard {
    public cost: number = 15;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ATMO_COLLECTORS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    } 

    public action(player: Player, game: Game) {
        if (this.resourceCount < 1) {
            this.resourceCount++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Remove 1 floater to gain 2 titanium", () => {
                this.resourceCount--;
                player.titanium += 2;
                LogHelper.logGainStandardResource(game, player, Resources.TITANIUM, 2);
                return undefined;
            }),
            new SelectOption("Remove 1 floater to gain 3 energy", () => {
                this.resourceCount--;
                player.energy += 3;
                LogHelper.logGainStandardResource(game, player, Resources.ENERGY, 3);
                return undefined;
            }),
            new SelectOption("Remove 1 floater to gain 4 heat", () => {
                this.resourceCount--;
                player.heat += 4;
                LogHelper.logGainStandardResource(game, player, Resources.HEAT, 4);
                return undefined;
            }),
            new SelectOption("Add 1 floater to this card", () => {
                this.resourceCount++;
                LogHelper.logAddResource(game, player, this);
                return undefined;
            })
        );
    }

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, this);
      return undefined;
    }
}

