import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { ICard } from '../ICard';
import { CardName } from '../../CardName';

export class CorroderSuits implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = CardName.CORRODER_SUITS;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,2);
        if (this.getResCards(player).length === 0) return undefined;
        return new SelectCard(
            'Select card to add 1 resource',
            this.getResCards(player),
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              return undefined;
            }
        );
    }
    public getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.FLOATER);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }
}