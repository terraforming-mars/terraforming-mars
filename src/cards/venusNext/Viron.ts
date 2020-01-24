
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Tags } from "../Tags";
import { ICard } from "../ICard";
import {SelectCard} from '../../inputs/SelectCard';

export class Viron implements ICard, CorporationCard {
    public name: string = "Viron";
    public tags: Array<Tags> = [Tags.MICROBES];
    public startingMegaCredits: number = 48;

    public canAct(player: Player): boolean {
        return player.getActionsThisGeneration().size > 0 && !player.getActionsThisGeneration().has(this.name); 
    }

    public action(player: Player, game: Game) {
        const result: Array<ICard> = [];
        for (const playedCard of player.playedCards) {
            if (
              playedCard.action !== undefined &&
                    playedCard.canAct !== undefined &&
                    player.getActionsThisGeneration().has(playedCard.name) &&
                    playedCard.canAct(player, game)) {
              result.push(playedCard);
            }
        }
        return new SelectCard(
            'Perform again an action from a played card',
            result,
            (foundCards: Array<ICard>) => {
              const foundCard = foundCards[0];
              const action = foundCard.action!(player, game);
              const whenDone = (err?: string) => {
                if (!err) {
                    player.setActionsThisGeneration(this.name);
                    player.actionsTakenThisRound++;
                }
                game.log(this.name + " used " + foundCard.name + " action");
                player.takeAction(game);
              };
              if (action !== undefined) {
                action.onend = whenDone;
                return action;
              }
              whenDone();
              return undefined;
            }
        );
        return undefined;
    }    

    public play() {
        return undefined;
    }
}
