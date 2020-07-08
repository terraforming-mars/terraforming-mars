
import { IActionCard, IResourceCard } from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from '../CardName';
import { LogHelper } from '../components/LogHelper';

export class GHGProducingBacteria implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: CardName = CardName.GHG_PRODUCING_BACTERIA;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (this.resourceCount > 1) {
            return new OrOptions(
                new SelectOption("Remove 2 microbes to raise temperature 1 step", () => {
                    player.removeResourceFrom(this,2);
                    LogHelper.logRemoveResource(game, player, this, 2, "raise temperature 1 step");
                    return game.increaseTemperature(player, 1);
                }),
                new SelectOption("Add 1 microbe to this card", () => {
                    player.addResourceTo(this);
                    LogHelper.logAddResource(game, player, this);
                    return undefined;
                })
            );
        }
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);
        return undefined;
    }
}
