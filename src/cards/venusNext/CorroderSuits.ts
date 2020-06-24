import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { ICard } from '../ICard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";
import { Game } from "../../Game";

export class CorroderSuits implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.CORRODER_SUITS;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,2);
        const cards = this.getResCards(player);

        if (cards.length === 0) return undefined;

        if (cards.length === 1) {
            player.addResourceTo(cards[0], 1);
            LogHelper.logAddResource(game, player, cards[0]);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 resource',
            this.getResCards(player),
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              LogHelper.logAddResource(game, player, foundCards[0]);
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