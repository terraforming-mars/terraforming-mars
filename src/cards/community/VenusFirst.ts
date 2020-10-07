import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { LogMessageType } from "../../LogMessageType";

export class VenusFirst extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.VENUS_FIRST;

    public play(player: Player, game: Game) {     
        game.increaseVenusScaleLevel(player, 2);

        if (game.hasCardsWithTag(Tags.VENUS, 2)) {
            for (let foundCard of game.drawCardsByTag(Tags.VENUS, 2)) {
                player.cardsInHand.push(foundCard);
            }

            const drawnCards = game.getCardsInHandByTag(player, Tags.VENUS).slice(-2);

            game.log(
                LogMessageType.DEFAULT,
                "${0} drew ${1} and ${2}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[0].name),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[1].name)
            );
        }

        return undefined;
    }
}

