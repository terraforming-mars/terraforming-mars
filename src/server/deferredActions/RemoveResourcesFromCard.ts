import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectOption} from '../inputs/SelectOption';
import {ICard} from '../cards/ICard';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';
import {message} from '../logs/MessageBuilder';
import {CardName} from '../../common/cards/CardName';

export type Source = 'self' | 'opponents' | 'all';
export type Response = {card: ICard | undefined, owner: IPlayer | undefined, proceed: boolean};
export class RemoveResourcesFromCard extends DeferredAction<Response> {
  public cardResource: CardResource | undefined;
  public count: number;
  private source: Source;
  private mandatory: boolean;
  private blockable: boolean;
  private autoselect: boolean;
  private title: string | Message;
  private log: boolean;

  public override priority: Priority = Priority.ATTACK_OPPONENT;
  constructor(
    player: IPlayer,
    cardResource: CardResource | undefined,
    count: number = 1,
    options?: {
      /** Which players to take from. Default all. */
      source?: Source,
      /** Resource must be removed (either it's a cost or the icon is not red-bordered.) default true. */
      mandatory?: boolean,
      /** If there's only one card, automatically select it. Default is true. Ignored if mandatory is false. */
      autoselect?: boolean
      title?: string | Message,
      blockable?: boolean,
      log?: boolean,
    }) {
    super(player, Priority.ATTACK_OPPONENT);
    this.cardResource = cardResource;
    this.count = count;
    this.source = options?.source ?? 'all';
    this.mandatory = options?.mandatory ?? true;
    this.blockable = options?.blockable ?? true;
    this.autoselect = options?.autoselect ?? true;
    this.log = options?.log ?? false;
    this.title = options?.title ?? (`Select card to remove ${count} ${cardResource}(s)`);
    if (this.source === 'self') {
      this.priority = Priority.LOSE_RESOURCE_OR_PRODUCTION;
      if (this.blockable) {
        throw new Error('Cannot block removing resources from self');
      }
    }
  }

  public execute() {
    if (this.source !== 'self' && this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
      this.cb({card: undefined, owner: undefined, proceed: true});
      return undefined;
    }

    const cards = RemoveResourcesFromCard.getAvailableTargetCards(this.player, this.cardResource, this.source);

    // Automa: MarsBot's MC supply can be targeted as if it held any resource type
    const marsBotOption = this.player.game.automaHooks?.getRemoveResourceOption(
      this.player, this.count, this.source, () => this.cb({card: undefined, owner: undefined, proceed: true}),
    );

    if (cards.length === 0 && marsBotOption === undefined) {
      this.cb({card: undefined, owner: undefined, proceed: false});
      return undefined;
    }

    const selectCard = cards.length > 0 ? new SelectCard(
      this.title,
      'Remove resource(s)',
      cards,
      {showOwner: this.source !== 'self'})
      .andThen(([card]) => {
        this.attack(card);
        return undefined;
      }) : undefined;

    // Build the options list
    const options: Array<SelectCard<ICard> | SelectOption> = [];
    if (selectCard !== undefined) options.push(selectCard);
    if (marsBotOption !== undefined) options.push(marsBotOption);

    if (this.mandatory) {
      if (options.length === 1 && cards.length === 1 && this.autoselect === true && marsBotOption === undefined) {
        this.attack(cards[0]);
        return undefined;
      }
      if (options.length === 1 && cards.length === 0 && marsBotOption !== undefined) {
        // Only MarsBot target available, auto-execute it
        this.player.game.automaHooks!.executeRemoveResource(
          this.player, this.count, () => this.cb({card: undefined, owner: undefined, proceed: true}),
        );
        return undefined;
      }
      if (options.length === 1) return options[0];
      return new OrOptions(...options);
    }

    return new OrOptions(
      ...options,
      new SelectOption('Do not remove'));
  }

  private attack(card: ICard) {
    const target = this.player.game.getCardPlayerOrThrow(card.name);

    // TODO(kberg): Consolidate the blockable in maybeBlock.
    if (this.blockable === false) {
      target.removeResourceFrom(card, this.count, {removingPlayer: this.player});
      this.cb({card: card, owner: target, proceed: true});
      return;
    }
    const msg = message('${0} ${1} from ${2}', (b) => b.number(this.count).string(card.resourceType || 'resources').card(card));
    target.defer(UnderworldExpansion.maybeBlockAttack(target, this.player, msg, (proceed) => {
      if (proceed) {
        target.removeResourceFrom(card, this.count, {removingPlayer: this.player, log: this.log});
      }
      this.cb({card: card, owner: target, proceed: proceed});
      return undefined;
    }));
  }

  /** Returns true if there are any valid targets (cards or MarsBot MC supply). */
  public static hasAvailableTargets(player: IPlayer, resourceType: CardResource | undefined, source: Source = 'all'): boolean {
    // Check MarsBot MC first (O(1)) before expensive card iteration (O(n*m))
    if (player.game.automaHooks?.hasRemoveResourceTarget(player, source)) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, resourceType, source).length > 0;
  }

  public static getAvailableTargetCards(player: IPlayer, resourceType: CardResource | undefined, source: Source = 'all'): Array<ICard> {
    const resourceCards: Array<ICard> = [];
    for (const p of player.game.allPlayers) {
      // Making this a function just to delay calling getCardsWithResources unless it's needed.
      const get = () => p.getCardsWithResources(resourceType).filter((card) => card.protectedResources !== true);
      if (p === player) {
        if (source !== 'opponents') {
          resourceCards.push(...get());
        }
      } else {
        if (source !== 'self') {
          const hasProtetedHabitats = p.tableau.has(CardName.PROTECTED_HABITATS);
          for (const card of get()) {
            if (hasProtetedHabitats) {
              if (card.resourceType === CardResource.ANIMAL || card.resourceType === CardResource.MICROBE) {
                continue;
              }
            }
            resourceCards.push(card);
          }
        }
      }
    }
    return resourceCards;
  }
}
