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
import {CardRenderer} from '../render/CardRenderer';

export class NitriteReducingBacteria extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.NITRITE_REDUCING_BACTERIA,
      tags: [Tag.MICROBE],
      cost: 11,
      resourceType: CardResource.MICROBE,

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: '157',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 3 microbes to increase your TR 1 step.', (eb) => {
            eb.microbes(3).startAction.tr(1);
          }).br;
          b.microbes(3);
        }),
        description: 'Add 3 microbes to this card.',
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    if (this.resourceCount < 3) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    const orOptions = new OrOptions();

    if (player.canAfford(0, {tr: {tr: 1}})) {
      orOptions.options.push(new SelectOption('Remove 3 microbes to increase your terraform rating 1 step', 'Remove microbes', () => {
        player.removeResourceFrom(this, 3, {log: false});
        LogHelper.logRemoveResource(player, this, 3, 'gain 1 TR');
        player.increaseTerraformRating();
        return undefined;
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
