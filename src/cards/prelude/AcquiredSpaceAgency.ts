import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ACQUIRED_SPACE_AGENCY;
    public play(player: Player, game: Game) {
        const drawnCards = game.drawCardsByTag(Tags.SPACE, 2);
        for (let foundCard of drawnCards) {
            player.cardsInHand.push(foundCard);
        }

        game.log(
             LogMessageType.DEFAULT,
            "${0} drew ${1} and ${2}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.CARD, drawnCards[0].name),
            new LogMessageData(LogMessageDataType.CARD, drawnCards[1].name)
        );

	    player.titanium += 6;
        return undefined;
    };
}

