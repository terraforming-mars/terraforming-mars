import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GHGProducingBacteria extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GHG_PRODUCING_BACTERIA,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 8,
      resourceType: CardResource.MICROBE,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        description: 'Requires 4% oxygen.',
        cardNumber: '034',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 2 microbes to raise temperature 1 step.', (eb) => {
            eb.microbes(2).startAction.temperature(1);
          });
        }),
      },
    });
  }


  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    if (this.resourceCount < 2) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    const orOptions = new OrOptions();

    if (player.canAfford(0, {tr: {temperature: 1}})) {
      orOptions.options.push(new SelectOption('Remove 2 microbes to raise temperature 1 step', 'Remove microbes', () => {
        player.removeResourceFrom(this, 2);
        LogHelper.logRemoveResource(player, this, 2, 'raise temperature 1 step');
        return player.game.increaseTemperature(player, 1);
      }));
    }

    orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
      player.addResourceTo(this, {log: true});
      return undefined;
    }));

    if (orOptions.options.length === 1) return orOptions.options[0].cb();
    return orOptions;
  }
}
