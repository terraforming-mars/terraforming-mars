
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
import { LogMessageType } from '../LogMessageType';
import { LogMessageData } from '../LogMessageData';
import { LogMessageDataType } from '../LogMessageDataType';

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
            this.resourceCount++;
            this.logAddMicrobe(game, player);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Remove 3 microbes to increase your terraform rating 1 step", () => {
                this.resourceCount -= 3;
                game.log(
                    LogMessageType.DEFAULT,
                    "${0} removed 3 microbes from ${1} to gain 1 TR",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.CARD, this.name)
                )
                player.increaseTerraformRating(game);
                return undefined;
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
            "${0} added 1 microbe to ${1}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.CARD, this.name)
        )
    }
}
