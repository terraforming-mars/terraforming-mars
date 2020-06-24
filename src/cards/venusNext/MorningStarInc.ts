
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from '../../Game';
import { CardName } from '../../CardName';
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class MorningStarInc implements CorporationCard {
    public name: CardName = CardName.MORNING_STAR_INC;
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 50;

    public initialAction(player: Player, game: Game) {
        if (game.hasCardsWithTag(Tags.VENUS, 3)) {
            for (let foundCard of game.drawCardsByTag(Tags.VENUS, 3)) {
                player.cardsInHand.push(foundCard);
            }

            const drawnCards = game.getCardsInHandByTag(player, Tags.VENUS).slice(-3);

            game.log(
                LogMessageType.DEFAULT,
                "${0} drew ${1}, ${2} and ${3}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[0].name),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[1].name),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[2].name)
            );
        }

        return undefined;
    }

    public getRequirementBonus(_player: Player, _game: Game, venusOnly?: boolean): number {
        if (venusOnly !== undefined && venusOnly) return 2;
        return 0;
    }

    public play() {
        return undefined;
    }
}
