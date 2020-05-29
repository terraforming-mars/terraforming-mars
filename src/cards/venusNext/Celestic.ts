
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';

export class Celestic implements IActionCard, CorporationCard, IResourceCard {
    public name: CardName = CardName.CELESTIC;
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 42;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public initialAction(player: Player, game: Game) {
        if (game.hasCardsWithResource(ResourceType.FLOATER, 2)) {
            for (let foundCard of game.drawCardsByResource(ResourceType.FLOATER, 2)) {
                player.cardsInHand.push(foundCard);
            }
        }
        game.logCorpFirstAction(player);
        return undefined;
    }

    public play() {
        return undefined;
    }

    public canAct(): boolean {
        return true; 
    }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 3);
    }

    public action(player: Player) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        if (floaterCards.length === 1) {
            this.resourceCount++;
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 floater',
            floaterCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 1);
            return undefined;
            }
        );
    }
}
