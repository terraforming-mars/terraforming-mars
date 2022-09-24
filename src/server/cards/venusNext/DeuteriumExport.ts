import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';

export class DeuteriumExport extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.DEUTERIUM_EXPORT,
      cardType: CardType.ACTIVE,
      tags: [Tag.SPACE, Tag.VENUS, Tag.ENERGY],
      cost: 11,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '221',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.or(Size.SMALL).br;
          b.action('Spend 1 floater here to increase your energy production 1 step.', (be) => {
            be.floaters(1).startAction.production((pb) => pb.energy(1));
          });
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    if (this.resourceCount < 1) {
      player.addResourceTo(this, 1);
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 1 floater to raise energy production 1 step', 'Remove floater', () => {
        this.resourceCount--;
        player.production.add(Resources.ENERGY, 1);
        return undefined;
      }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this, 1);
        return undefined;
      }),
    );
  }
}
