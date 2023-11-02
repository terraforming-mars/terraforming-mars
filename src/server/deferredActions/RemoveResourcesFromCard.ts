import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectOption} from '../inputs/SelectOption';
import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {DeferredAction, Priority} from './DeferredAction';
import {Message} from '../../common/logs/Message';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

// TODO (kberg chosta): Make this a card attribute instead
const animalsProtectedCards = [CardName.PETS, CardName.BIOENGINEERING_ENCLOSURE];

export class RemoveResourcesFromCard extends DeferredAction<boolean> {
  public resourceType: CardResource;
  public count: number;
  private ownCardsOnly: boolean;
  private mandatory: boolean;
  private blockable: boolean;
  private title: string | Message;

  public override priority = Priority.ATTACK_OPPONENT;
  constructor(
    player: IPlayer,
    resourceType: CardResource,
    count: number = 1,
    options?: {
      // TODO(kberg): if ownCardsOnly, don't make it blockable?
      ownCardsOnly?: boolean, // default false
      mandatory?: boolean, // default true (Resource must be removed (either it's a cost or the icon is not red-bordered))
      title?: string | Message,
      blockable?: boolean,
    }) {
    super(player, Priority.ATTACK_OPPONENT);
    this.resourceType = resourceType;
    this.count = count;
    this.ownCardsOnly = options?.ownCardsOnly ?? false;
    this.mandatory = options?.mandatory ?? true;
    this.blockable = options?.blockable ?? true;
    this.title = options?.title ?? (`Select card to remove ${count} ${resourceType}(s)`);
    if (this.ownCardsOnly === true) {
      this.priority = Priority.LOSE_RESOURCE_OR_PRODUCTION;
    }
  }

  public execute() {
    if (this.ownCardsOnly === false && this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
      return undefined;
    }

    const cards = RemoveResourcesFromCard.getAvailableTargetCards(this.player, this.resourceType, this.ownCardsOnly);

    if (cards.length === 0) {
      return undefined;
    }

    const selectCard = new SelectCard(
      this.title,
      'Remove resource(s)',
      cards,
      {showOwner: true})
      .andThen(([card]) => {
        this.attack(card);
        return undefined;
      });

    if (this.mandatory) {
      if (cards.length === 1) {
        this.attack(cards[0]);
        return undefined;
      }
      return selectCard;
    }

    return new OrOptions(
      selectCard,
      new SelectOption('Do not remove'));
  }

  private attack(card: ICard) {
    const target = this.player.game.getCardPlayerOrThrow(card.name);

    // TODO(kberg): Consolidate the blockable in mayBlock.
    if (this.blockable === false) {
      target.removeResourceFrom(card, this.count, {removingPlayer: this.player});
      this.cb(true);
      return;
    }
    return UnderworldExpansion.maybeBlockAttack(target, this.player, ((proceed) => {
      if (proceed) {
        target.removeResourceFrom(card, this.count, {removingPlayer: this.player});
      }
      this.cb(proceed);
      return undefined;
    }));
  }

  public static getAvailableTargetCards(player: IPlayer, resourceType: CardResource | undefined, ownCardsOnly: boolean = false): Array<ICard> {
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
