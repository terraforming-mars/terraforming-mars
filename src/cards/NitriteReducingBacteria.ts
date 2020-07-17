
import { IActionCard, IResourceCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from '../CardName';
import { Game } from '../Game';
import { LogHelper } from '../components/LogHelper';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';
import { REDS_RULING_POLICY_COST } from '../constants';

export class NitriteReducingBacteria implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 11;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.NITRITE_REDUCING_BACTERIA;

    public play(player: Player) {
        player.addResourceTo(this,3);
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (this.resourceCount < 3) {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        }

        let orOptions = new OrOptions();
        const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

        if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
            orOptions.options.push(new SelectOption("Remove 3 microbes to increase your terraform rating 1 step", () => {
                this.resourceCount -= 3;
                LogHelper.logRemoveResource(game, player, this, 3, "gain 1 TR");
                player.increaseTerraformRating(game);
                return undefined;
            }));
        }

        orOptions.options.push(new SelectOption("Add 1 microbe to this card", () => {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        }));

        if (orOptions.options.length === 1) return orOptions.options[0].cb();
        return orOptions;
    }
}
