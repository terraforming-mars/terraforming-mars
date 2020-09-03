import { Game } from "../Game";
import { Player } from "../Player";
import { ICard } from "../cards/ICard";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { Resources } from "../Resources";
import { ISpace } from "../ISpace";
import { TileType } from "../TileType";
import { IColony } from "../colonies/Colony";
import { MAX_COLONY_TRACK_POSITION } from "../constants";

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

    static logTilePlacement(game: Game, player: Player, space: ISpace, tileType: TileType) {

        // Skip off-grid tiles
        if (space.x === -1 && space.y === -1) return;

        let type : string;
        let offset: number = Math.abs(space.y - 4);
        let row: number = space.y + 1;
        let position: number = space.x - offset + 1;

        switch (tileType) {
            case TileType.GREENERY:
                type = "greenery";
                break;

            case TileType.CITY:
                type = "city";
                break;

            case TileType.OCEAN:
                type = "ocean";
                break;
        
            default:
                type = "special";
                break;
        }

        game.log(
            LogMessageType.DEFAULT,
            "${0} placed ${1} tile on row ${2} position ${3}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, type),
            new LogMessageData(LogMessageDataType.STRING, row.toString()),
            new LogMessageData(LogMessageDataType.STRING, position.toString())            
        );
    }

    static logColonyTrackIncrease(game: Game, player: Player, colony: IColony) {
        const stepsIncreased = Math.min(player.colonyTradeOffset, MAX_COLONY_TRACK_POSITION - colony.trackPosition);
        
        game.log(
            LogMessageType.DEFAULT,
            "${0} increased ${1} colony track ${2} step(s)",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, colony.name),
            new LogMessageData(LogMessageDataType.STRING, stepsIncreased.toString())
        );
    }
}