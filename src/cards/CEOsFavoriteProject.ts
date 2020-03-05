import {ICard} from './ICard';

import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Tags} from './Tags';
import {SelectCard} from '../inputs/SelectCard';
import { CardName } from '../CardName';

export class CEOsFavoriteProject implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = CardName.CEOS_FAVORITE_PROJECT;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return this.getAvailableCards(player).length > 0;
    }
    private getAvailableCards(player: Player): Array<ICard> {
      return player.getCardsWithResources().filter(
          (card) => player.getResourcesOnCard(card)
      );
    }
    public play(player: Player) {
      const availableCards = this.getAvailableCards(player);
      return new SelectCard(
          'Select card to add resource',
          availableCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0]);
            return undefined;
          }
      );
    }
}

