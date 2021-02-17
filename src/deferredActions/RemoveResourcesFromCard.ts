import {Player} from '../Player';
import {ResourceType} from '../ResourceType';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectOption} from '../inputs/SelectOption';
import {CardName} from '../CardName';
import {ICard} from '../cards/ICard';
import {DeferredAction, Priority} from './DeferredAction';

// TODO (kberg chosta): Make this a card attribute instead
const animalsProtectedCards = [CardName.PETS, CardName.BIOENGINEERING_ENCLOSURE];

export class RemoveResourcesFromCard implements DeferredAction {
  public priority= Priority.ATTACK_OPPONENT;
  constructor(
        public player: Player,
        public resourceType: ResourceType,
        public count: number = 1,
        public ownCardsOnly: boolean = false,
        public mandatory: boolean = true, // Resource must be removed (either it's a cost or the icon is not red-bordered)
        public title: string = 'Select card to remove ' + count + ' ' + resourceType + '(s)',
  ) {
    if (ownCardsOnly) {
      this.priority = Priority.LOSE_RESOURCE_OR_PRODUCTION;
    }
  }

  public execute() {
    if (this.ownCardsOnly === false && this.player.game.isSoloMode()) {
      return undefined;
    }

    const resourceCards = RemoveResourcesFromCard.getAvailableTargetCards(this.player, this.resourceType, this.ownCardsOnly);

    if (resourceCards.length === 0) {
      return undefined;
    }

    const selectCard = new SelectCard(
      this.title,
      'Remove resource(s)',
      resourceCards,
      (foundCards: Array<ICard>) => {
        const card = foundCards[0];
        const owner = this.player.game.getCardPlayer(card.name);
        owner.removeResourceFrom(card, this.count, this.player.game, this.player);
        return undefined;
      },
    );

    if (this.mandatory) {
      if (resourceCards.length === 1) {
        const card = resourceCards[0];
        const owner = this.player.game.getCardPlayer(card.name);
        owner.removeResourceFrom(card, this.count, this.player.game, this.player);
        return undefined;
      }
      return selectCard;
    }

    return new OrOptions(
      selectCard,
      new SelectOption('Do not remove', 'Confirm', () => {
        return undefined;
      }),
    );
  }

  public static getAvailableTargetCards(player: Player, resourceType: ResourceType | undefined, ownCardsOnly: boolean = false): Array<ICard> {
    let resourceCards: Array<ICard>;
    if (ownCardsOnly) {
      if (resourceType === ResourceType.ANIMAL) {
        resourceCards = player.getCardsWithResources(resourceType).filter((card) => animalsProtectedCards.includes(card.name) === false);
      } else {
        resourceCards = player.getCardsWithResources(resourceType);
      }
    } else {
      resourceCards = [];
      player.game.getPlayers().forEach((p) => {
        switch (resourceType) {
        case ResourceType.ANIMAL:
          if (p.hasProtectedHabitats() && player.id !== p.id) return;
          resourceCards.push(...p.getCardsWithResources(resourceType).filter((card) => animalsProtectedCards.includes(card.name) === false));
          break;
        case ResourceType.MICROBE:
          if (p.hasProtectedHabitats() && player.id !== p.id) return;
        default:
          resourceCards.push(...p.getCardsWithResources(resourceType));
        }
      });
    }
    return resourceCards;
  }
}
