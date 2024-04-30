import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

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

  public targetCards: Array<IProjectCard> = [];

  public override getCardDiscount(_player: IPlayer, card: IProjectCard): number {
    return this.targetCards.find((c) => c.name === card.name)?.resourceCount ?? 0;
  }

  public canAct(player: IPlayer): boolean {
    return this.targetCards.length > 0 ||
             player.cardsInHand.some((card) => card.tags.some((tag) => tag === Tag.SPACE || tag === Tag.BUILDING));
  }

  public action(player: IPlayer) {
    const orOptions = new OrOptions();
    const selectableCards = player.cardsInHand.filter((card) => card.tags.some((tag) => tag === Tag.SPACE || tag === Tag.BUILDING));

    if (this.targetCards.length > 0) {
      orOptions.options.push(new SelectCard(
        'Select card to double robots resource', 'Double resource', this.targetCards, {played: CardName.SELF_REPLICATING_ROBOTS})
        .andThen(([card]) => {
          const resourceCount = card.resourceCount;
          card.resourceCount *= 2;
          player.game.log('${0} doubled resources on ${1} from ${2} to ${3}', (b) => {
            b.player(player).card(card).number(resourceCount).number(card.resourceCount);
          });
          return undefined;
        }));
    }

    if (selectableCards.length > 0) {
      orOptions.options.push(new SelectCard(
        'Select card to link with Self-replicating Robots',
        'Link card', selectableCards,
        {played: CardName.SELF_REPLICATING_ROBOTS}).andThen(
        ([card]) => {
          const projectCardIndex = player.cardsInHand.findIndex((c) => c.name === card.name);
          player.cardsInHand.splice(projectCardIndex, 1);
          this.targetCards.push(card);
          card.resourceCount = 2;
          player.game.log('${0} linked ${1} with ${2}', (b) => b.player(player).card(card).card(this));
          return undefined;
        }));
    }

    return orOptions;
  }
}
