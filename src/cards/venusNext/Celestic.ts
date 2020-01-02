
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { IActionCard } from '../ICard';
import { SelectCard } from '../../inputs/SelectCard';
import { IProjectCard } from '../IProjectCard';
import { CardType } from '../CardType';

export class Celestic implements IActionCard, CorporationCard {
    public name: string = "Celestic";
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 42;
    public resourceType: ResourceType = ResourceType.FLOATER;

    // Hack to mimic project card
    public cost: number = 0;
    public canPlay() {return true;}
    public cardType: CardType = CardType.ACTIVE;
    // End of hack

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
        const otherFloaterCards = player.getOtherResourceCards(ResourceType.FLOATER);
        if (otherFloaterCards.length < 1) {
            player.addResourceTo(this);
            return undefined;
        }

        //Add this card to candidates
        otherFloaterCards.push(this);

        return new SelectCard(
            'Select card to add 1 floater',
            otherFloaterCards,
            (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 1);
            return undefined;
            }
        );
    }
}
