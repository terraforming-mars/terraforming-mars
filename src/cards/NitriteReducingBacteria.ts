
import { IActionCard, IResourceCard } from './ICard';
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

export class NitriteReducingBacteria implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 11;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.NITRITE_REDUCING_BACTERIA;

    public play() {
        this.resourceCount += 3;
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
        return new OrOptions(
            new SelectOption("Remove 3 microbes to increase your terraform rating 1 step", () => {
                this.resourceCount -= 3;
                LogHelper.logRemoveResource(game, player, this, 3, "gain 1 TR");
                player.increaseTerraformRating(game);
                return undefined;
            }),
            new SelectOption("Add 1 microbe to this card", () => {
                player.addResourceTo(this);
                LogHelper.logAddResource(game, player, this);
                return undefined;
            })
        );
    }
}
