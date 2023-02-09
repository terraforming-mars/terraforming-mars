import {Player} from '../Player';
import {CardResource} from '../../common/CardResource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectOption} from '../inputs/SelectOption';
import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {DeferredAction, Priority} from './DeferredAction';

// TODO (kberg chosta): Make this a card attribute instead
const animalsProtectedCards = [CardName.PETS, CardName.BIOENGINEERING_ENCLOSURE];

export class RemoveResourcesFromCard extends DeferredAction {
  public override priority = Priority.ATTACK_OPPONENT;
  constructor(
    player: Player,
    public resourceType: CardResource,
    public count: number = 1,
    public ownCardsOnly: boolean = false,
    public mandatory: boolean = true, // Resource must be removed (either it's a cost or the icon is not red-bordered)
    public title: string = 'Select card to remove ' + count + ' ' + resourceType + '(s)',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
    if (ownCardsOnly) {
      this.priority = Priority.LOSE_RESOURCE_OR_PRODUCTION;
    }
  }

  public execute() {
    if (this.ownCardsOnly === false && this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
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
      ([card]) => {
        const owner = this.player.game.getCardPlayer(card.name);
        owner.removeResourceFrom(card, this.count, {removingPlayer: this.player});
        return undefined;
      },
      {
        showOwner: true,
      },
    );

    if (this.mandatory) {
      if (resourceCards.length === 1) {
        const card = resourceCards[0];
        const owner = this.player.game.getCardPlayer(card.name);
        owner.removeResourceFrom(card, this.count, {removingPlayer: this.player});
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

  public static getAvailableTargetCards(player: Player, resourceType: CardResource | undefined, ownCardsOnly: boolean = false): Array<ICard> {
    let resourceCards: Array<ICard>;
    if (ownCardsOnly) {
      if (resourceType === CardResource.ANIMAL) {
        resourceCards = player.getCardsWithResources(resourceType).filter((card) => animalsProtectedCards.includes(card.name) === false);
      } else {
        resourceCards = player.getCardsWithResources(resourceType);
      }
    } else {
      resourceCards = [];
      player.game.getPlayers().forEach((p) => {
        switch (resourceType) {
        case CardResource.ANIMAL:
          if (p.hasProtectedHabitats() && player.id !== p.id) return;
          resourceCards.push(...p.getCardsWithResources(resourceType).filter((card) => animalsProtectedCards.includes(card.name) === false));
          break;
        case CardResource.MICROBE:
          if (p.hasProtectedHabitats() && player.id !== p.id) return;
          // This fallthrough is intentional
        default: // eslint-disable-line no-fallthrough
          resourceCards.push(...p.getCardsWithResources(resourceType));
        }
      });
    }
    return resourceCards;
  }
}
