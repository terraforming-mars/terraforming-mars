
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { IActionCard, ICard } from '../ICard';
import { SelectCard } from '../../inputs/SelectCard';

export class Celestic implements IActionCard, CorporationCard {
    public name: string = "Celestic";
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 42;
    public resourceType: ResourceType = ResourceType.FLOATER;

    public initialAction(player: Player, game: Game) {
        for (let foundCard of game.drawCardsByResource(ResourceType.FLOATER, 2)) {
            player.cardsInHand.push(foundCard);
        }
        return undefined;
    }

    public play() {
        return undefined;
    }

    public canAct(): boolean {
        return true; 
    }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 3);
    }

    public action(player: Player) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        if (floaterCards.length === 1) {
            player.addResourceTo(this);
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
