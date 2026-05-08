import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class VenusianHeatExchangers extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENUSIAN_HEAT_EXCHANGERS,
      tags: [Tag.VENUS],
      cost: 12,
      requirements: {venus: 14},
      metadata: {
        cardNumber: 'B40',
        description: 'Requires at least 14% Venus.',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease Heat production 2 steps to raise TR 1 step, OR remove 2 Floaters from anywhere to increase Heat production 2 steps.', (ab) => {
            ab.production((pb) => pb.minus().heat(2)).startAction.tr(1).br;
            ab.or().br;
            ab.resource(CardResource.FLOATER, -2).asterix().startAction.production((pb) => pb.heat(2));
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    const canSpendHeat = player.production.heat >= 2;
    const floaterCards = player.playedCards.filter((c) => c.resourceType === CardResource.FLOATER);
    const totalFloaters = floaterCards.reduce((sum, c) => sum + c.resourceCount, 0);
    return canSpendHeat || totalFloaters >= 2;
  }

  public action(player: IPlayer) {
    const floaterCards = player.playedCards.filter((c) => c.resourceType === CardResource.FLOATER);
    const totalFloaters = floaterCards.reduce((sum, c) => sum + c.resourceCount, 0);
    const options: Array<SelectOption> = [];

    if (player.production.heat >= 2) {
      options.push(new SelectOption('Decrease Heat production 2 to raise TR 1 step', 'Spend Heat production').andThen(() => {
        player.production.add(Resource.HEAT, -2, {log: true});
        player.increaseTerraformRating();
        return undefined;
      }));
    }

    if (totalFloaters >= 2) {
      options.push(new SelectOption('Remove 2 Floaters from anywhere to increase Heat production 2 steps', 'Remove Floaters').andThen(() => {
        let toRemove = 2;
        for (const card of floaterCards) {
          if (toRemove <= 0) break;
          const amt = Math.min(toRemove, card.resourceCount);
          player.removeResourceFrom(card, amt, {log: true});
          toRemove -= amt;
        }
        player.production.add(Resource.HEAT, 2, {log: true});
        return undefined;
      }));
    }

    if (options.length === 1) return options[0].andThen(() => undefined);
    return new OrOptions(...options);
  }
}
