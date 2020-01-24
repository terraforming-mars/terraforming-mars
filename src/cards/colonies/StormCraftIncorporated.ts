import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from '../../ResourceType';
import {ICard, IActionCard} from '../ICard';
import { SelectCard } from '../../inputs/SelectCard';
import { CorporationName } from '../../CorporationName';

export class StormCraftIncorporated implements IActionCard, CorporationCard {
    public name: string =  CorporationName.STORMCRAFT_INCORPORATED;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public startingMegaCredits: number = 48;
    public resourceType: ResourceType = ResourceType.FLOATER;

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
