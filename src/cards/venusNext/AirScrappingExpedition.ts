import {ICard} from '../ICard';
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';


export class AirScrappingExpedition implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = CardName.AIR_SCRAPPING_EXPEDITION;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player) {
        let floaterCards = player.getResourceCards(ResourceType.FLOATER);
        floaterCards = floaterCards.filter(card => card.tags.filter((cardTag) => cardTag === Tags.VENUS).length > 0 );
        if (floaterCards.length === 0) {
            return undefined;
        }   

        return new SelectCard(
            'Select card to add 3 floaters',
            floaterCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 3);
            return undefined;
            }
        );
    }
}