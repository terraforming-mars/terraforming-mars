import {IProjectCard, isIProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ICard} from '../ICard';
import {LogHelper} from '../../LogHelper';
import {Card} from '../Card';
import {RobotCardProxy} from './RobotCardProxy';

export class SelfReplicatingRobots extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SELF_REPLICATING_ROBOTS,
      cost: 7,

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        cardNumber: '210',
        renderData: CardRenderer.builder((b) => {
          b.action('Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.', (eb) => {
            eb.empty().startAction.selfReplicatingRobots();
            eb.nbsp.or().nbsp.arrow().multiplierWhite().text('x2');
          }).br;
          b.text('Effect: Card here may be played as if from hand with its cost reduced by the number of resources on it.', Size.TINY, true);
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }

  public data: {robotCards: Partial<Record<CardName, number>>} = {robotCards: {}};

  public override getCardDiscount(_player: IPlayer, card: IProjectCard): number {
    return this.data.robotCards[card.name] ?? 0;
  }

  /** List of candidate cards to attach to SRR from the player's hand */
  private attachableCards(player: IPlayer): Array<IProjectCard> {
    return player.cardsInHand.filter((card) =>
      card.tags.some((tag) => tag === Tag.SPACE || tag === Tag.BUILDING) &&this.data.robotCards[card.name] === undefined,
    ) ?? [];
  }

  /** Return a list of Proxy cards */
  public getRobotCards(): Array<IProjectCard> {
    const cards: Array<IProjectCard> = [];
    for (const key in this.data.robotCards) {
      if (key in CardName) {
        const cardName = key as CardName;
        cards.push(new RobotCardProxy(cardName, this.data.robotCards[cardName] ?? 0));
      }
    }
    return cards;
  }

  public canAct(player: IPlayer): boolean {
    return this.getRobotCards().length > 0 || this.attachableCards(player).length > 0;
  }

  public action(player: IPlayer) {
    const orOptions = new OrOptions();

    // Double resources on attached card
    if (this.getRobotCards().length > 0) {
      orOptions.options.push(new SelectCard(
        'Select card to double robots resource',
        'Double resource',
        this.getRobotCards(),
        {played: CardName.SELF_REPLICATING_ROBOTS},
      ).andThen(([card]) => {
        this.addResourcesToAttachedCard(player, card as RobotCardProxy, 'double');
        return undefined;
      }));
    }

    // Attach a new card
    if (this.attachableCards(player).length > 0) {
      orOptions.options.push(new SelectCard(
        'Select card to link with Self-Replicating Robots',
        'Link card', this.attachableCards(player),
        {played: CardName.SELF_REPLICATING_ROBOTS}).andThen(
        ([card]) => {
          this.data.robotCards[card.name] = 2;
          player.game.log('${0} linked ${1} with ${2}', (b) => b.player(player).card(card).card(this));
          return undefined;
        }));
    }

    return orOptions;
  }

  /** Remove the card from the record if its attached */
  public onCardPlayed(_player: IPlayer, card: ICard): void {
    if (isIProjectCard(card)) {
      delete this.data.robotCards[card.name];
    }
  }

  /** Add some amount or resource to this card, or double the amount of resources */
  public addResourcesToAttachedCard(player: IPlayer, card: RobotCardProxy, amount: number | 'double'): void {
    const resourceCount = this.data.robotCards[card.name];
    if (resourceCount !== undefined) {
      const total = amount === 'double' ? resourceCount * 2 : resourceCount + amount;
      this.data.robotCards[card.name] = total;
      if (amount === 'double') {
        player.game.log('${0} added resources on ${1} from ${2} to ${3}', (b) => {
          b.player(player).cardName(card.name).number(resourceCount).number(total);
        });
      } else {
        LogHelper.logAddResource(player, card);
      }
    } else {
      throw new Error('Selected card is not attached to Self-Replicating Robots');
    }
  }
}
