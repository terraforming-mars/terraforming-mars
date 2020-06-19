
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
import { LogMessageType } from '../LogMessageType';
import { LogMessageData } from '../LogMessageData';
import { LogMessageDataType } from '../LogMessageDataType';

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
            this.resourceCount++;
            this.logAddMicrobe(game, player);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Remove 2 microbes to raise oxygen level 1 step", () => {
                player.removeResourceFrom(this, 2);
                game.log(
                    LogMessageType.DEFAULT,
                    "${0} removed 2 microbes from ${1} to raise oxygen level 1 step",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.CARD, this.name)
                )
                return game.increaseOxygenLevel(player, 1);
            }),
            new SelectOption("Add 1 microbe to this card", () => {
                this.resourceCount++;
                this.logAddMicrobe(game, player);
                return undefined;
            })
        );
    }
    private logAddMicrobe(game: Game, player: Player) {
        game.log(
            LogMessageType.DEFAULT,
            "${0} removed 2 microbes from ${1} to raise oxygen level 1 step",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.CARD, this.name)
        )
    }
}
