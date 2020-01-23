import { IProjectCard } from "../IProjectCard";
import {ICard, IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';


export class Dirigibles implements IActionCard,IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.VENUS];

    public name: string = CardName.DIRIGIBLES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
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