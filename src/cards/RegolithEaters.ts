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

export class RegolithEaters implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: CardName = CardName.REGOLITH_EATERS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (this.resourceCount < 2) {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Remove 2 microbes to raise oxygen level 1 step", () => {
                player.removeResourceFrom(this, 2);
                LogHelper.logRemoveResource(game, player, this, 2, "raise oxygen 1 step");
                return game.increaseOxygenLevel(player, 1);
            }),
            new SelectOption("Add 1 microbe to this card", () => {
                player.addResourceTo(this);
                LogHelper.logAddResource(game, player, this);
                return undefined;
            })
        );
    }
}
