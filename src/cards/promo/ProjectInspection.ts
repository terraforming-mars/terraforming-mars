import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { ICard } from "../ICard";
import { SelectCard } from "../../inputs/SelectCard";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { LogMessageType } from "../../LogMessageType";

export class ProjectInspection implements IProjectCard {

    public name: CardName = CardName.PROJECT_INSPECTION;
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;
    private getActionCards(player: Player, game: Game): Array<ICard> {
        let result: Array<ICard> = [];

        if (
            player.corporationCard !== undefined &&
                player.getActionsThisGeneration().has(player.corporationCard.name) &&
                player.corporationCard.action !== undefined &&
                player.corporationCard.canAct !== undefined &&
                player.corporationCard.canAct(player, game)) {
            result.push(player.corporationCard);
          }
          
        for (const playedCard of player.playedCards) {
            if (playedCard.action !== undefined && playedCard.canAct !== undefined && playedCard.canAct(player, game) && player.getActionsThisGeneration().has(playedCard.name)) {
                result.push(playedCard);
            }
        }
        return result;
    }

    public canPlay(player: Player, game: Game): boolean {
        return this.getActionCards(player, game).length > 0;
    }

    public play(player: Player, game: Game) {
        if (this.getActionCards(player, game).length === 0 ) {
            return undefined;
        }
        return new SelectCard(
            "Perform an action from a played card again",
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

}