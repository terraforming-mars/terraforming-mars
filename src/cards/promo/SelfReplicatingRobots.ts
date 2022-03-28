import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Size} from '../../common/cards/render/Size';

export interface RobotCard {
    card: IProjectCard;
    resourceCount: number;
}

export class SelfReplicatingRobots extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SELF_REPLICATING_ROBOTS,
      cost: 7,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '210',
        renderData: CardRenderer.builder((b) => {
          b.action('Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.', (eb) => {
            eb.empty().startAction.selfReplicatingRobots();
            eb.nbsp.or().nbsp.arrow().multiplierWhite().text('x2');
          }).br;
          b.text('Effect: Card here may be played as if from hand with its cost reduced by the number of resources on it.', Size.TINY, true);
        }),
        description: 'Requires 2 Science tags.',
      },
    });
  }

  public targetCards: Array<RobotCard> = [];

  public override getCardDiscount(_player: Player, card: IProjectCard): number {
    for (const targetCard of this.targetCards) {
      if (targetCard.card.name === card.name) {
        return targetCard.resourceCount;
      }
    }
    return 0;
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return this.targetCards.length > 0 ||
             player.cardsInHand.some((card) => card.tags.some((tag) => tag === Tags.SPACE || tag === Tags.BUILDING));
  }

  public action(player: Player) {
    const orOptions = new OrOptions();
    const selectableCards = player.cardsInHand.filter((card) => card.tags.some((tag) => tag === Tags.SPACE || tag === Tags.BUILDING));

    if (this.targetCards.length > 0) {
      const robotCards = this.targetCards.map((targetCard) => targetCard.card);
      orOptions.options.push(new SelectCard(
        'Select card to double robots resource', 'Double resource', robotCards,
        (foundCards: Array<IProjectCard>) => {
          let resourceCount = 0;
          for (const targetCard of this.targetCards) {
            if (targetCard.card.name === foundCards[0].name) {
              resourceCount = targetCard.resourceCount;
              targetCard.resourceCount *= 2;
            }
          }
          player.game.log('${0} doubled resources on ${1} from ${2} to ${3}', (b) => {
            b.player(player).card(foundCards[0]).number(resourceCount).number(resourceCount * 2);
          });
          return undefined;
        },
      ));
    }

    if (selectableCards.length > 0) {
      orOptions.options.push(new SelectCard(
        'Select card to link with Self-Replicating Robots',
        'Link card', selectableCards,
        (foundCards: Array<IProjectCard>) => {
          const projectCardIndex = player.cardsInHand.findIndex((card) => card.name === foundCards[0].name);
          player.cardsInHand.splice(projectCardIndex, 1);
          this.targetCards.push(
            {
              card: foundCards[0],
              resourceCount: 2,
            },
          );
          player.game.log('${0} linked ${1} with ${2}', (b) => b.player(player).card(foundCards[0]).card(this));
          return undefined;
        },
      ));
    }

    return orOptions;
  }
}
