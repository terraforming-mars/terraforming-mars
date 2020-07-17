import { Game } from "../Game";
import { Player } from "../Player";
import { ICard } from "../cards/ICard";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { Resources } from "../Resources";

export class LogHelper {
    static logAddResource(game: Game, player: Player, card: ICard, qty: number = 1): void {
        let resourceType = "resource(s)"

        if (card.resourceType) {
            resourceType = card.resourceType.toLowerCase() + "(s)";
        }

        game.log(
            LogMessageType.DEFAULT,
            "${0} added ${1} ${2} to ${3}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, qty.toString()),
            new LogMessageData(LogMessageDataType.STRING, resourceType),
            new LogMessageData(LogMessageDataType.CARD, card.name)
        );
    }

    static logRemoveResource(game: Game, player: Player, card: ICard, qty: number = 1, effect: string): void {
        let resourceType = "resource(s)"

        if (card.resourceType) {
            resourceType = card.resourceType.toLowerCase() + "(s)";
        }

        game.log(
            LogMessageType.DEFAULT,
            "${0} removed ${1} ${2} from ${3} to ${4}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, qty.toString()),
            new LogMessageData(LogMessageDataType.STRING, resourceType),
            new LogMessageData(LogMessageDataType.CARD, card.name),
            new LogMessageData(LogMessageDataType.STRING, effect)
        );
    }

    static logGainStandardResource(game: Game, player: Player, resource: Resources, qty: number = 1) {
        game.log(
            LogMessageType.DEFAULT,
            "${0} gained ${1} ${2}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, qty.toString()),
            new LogMessageData(LogMessageDataType.STRING, resource)
        );
    }

    static logGainProduction(game: Game, player: Player, resource: Resources, qty: number = 1) {
        game.log(
            LogMessageType.DEFAULT,
            "${0}'s ${1} production increased by ${2}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, resource),
            new LogMessageData(LogMessageDataType.STRING, qty.toString())
        );
    }

    static logCardChange(game: Game, player: Player, effect: string, qty: number = 1) {
        game.log(
            LogMessageType.DEFAULT,
            "${0} ${1} ${2} card(s)",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, effect),
            new LogMessageData(LogMessageDataType.STRING, qty.toString())
        );
    }
}