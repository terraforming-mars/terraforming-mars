
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Tags } from "../Tags";
import { ICard } from "../ICard";
import {SelectCard} from '../../inputs/SelectCard';
import { CardName } from '../../CardName';

export class Viron implements ICard, CorporationCard {
    public name: string = CardName.VIRON;
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
            'Perform again an action from a played card',
            this.getActionCards(player, game),
            (foundCards: Array<ICard>) => {
              const foundCard = foundCards[0];
              game.log(player.name + " used " + foundCard.name + " action with " + this.name);
              return foundCard.action!(player, game);
            }
        );
    }

    public play() {
        return undefined;
    }
}
