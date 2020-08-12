
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Tags } from "../Tags";
import { ICard } from "../ICard";
import {SelectCard} from "../../inputs/SelectCard";
import { CardName } from "../../CardName";
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class Viron implements ICard, CorporationCard {
    public name: CardName = CardName.VIRON;
    public tags: Array<Tags> = [Tags.MICROBES];
    public startingMegaCredits: number = 48;

    private getActionCards(player: Player, game: Game):Array<ICard> {
        let result: Array<ICard> = [];
        for (const playedCard of player.playedCards) {
            if (
              playedCard.action !== undefined &&
                    playedCard.canAct !== undefined &&
                    player.getActionsThisGeneration().has(playedCard.name) &&
                    playedCard.canAct(player, game)) {
              result.push(playedCard);
            }
        }
        return result;
    }

    public canAct(player: Player, game: Game): boolean {
        return this.getActionCards(player, game).length > 0 && !player.getActionsThisGeneration().has(this.name);
    }

    public action(player: Player, game: Game) {
        if (this.getActionCards(player, game).length === 0 ) {
            return undefined;
        }
 
        return new SelectCard(
            "Perform again an action from a played card",
            "Take action",
            this.getActionCards(player, game),
            (foundCards: Array<ICard>) => {
              const foundCard = foundCards[0];
              game.log(
                LogMessageType.DEFAULT,
                "${0} used ${1} action with ${2}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, foundCard.name),
                new LogMessageData(LogMessageDataType.CARD, this.name)
              );
              return foundCard.action!(player, game);
            }
        );
    }

    public play() {
        return undefined;
    }
}
