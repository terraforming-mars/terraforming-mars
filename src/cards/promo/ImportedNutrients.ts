import {ICard} from './../ICard';
import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { SelectCard } from "../../inputs/SelectCard";
import { ResourceType } from '../../ResourceType';
import { CardName } from '../../CardName';

export class ImportedNutrients implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMPORTED_NUTRIENTS;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player) {
        player.plants += 4;
        const microbeCards = player.getResourceCards(ResourceType.MICROBE);

        if (microbeCards.length === 1) {
            player.addResourceTo(microbeCards[0], 4);
            return undefined;
        } else if (microbeCards.length > 1) {
            return new SelectCard("Select card to add 4 microbes", microbeCards, (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 4);
                return undefined;
            });
        }

        return undefined;
    }
}
