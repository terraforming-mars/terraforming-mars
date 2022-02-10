import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../common/ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';

export class DeuteriumExport extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.DEUTERIUM_EXPORT,
      cardType: CardType.ACTIVE,
      tags: [Tags.SPACE, Tags.VENUS, Tags.ENERGY],
      cost: 11,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '221',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.or(Size.SMALL).br;
          b.action('Spend 1 Floater here to increase your energy production 1 step.', (be) => {
            be.floaters(1).startAction.production((pb) => pb.energy(1));
          });
        }),
      },
    });
  }

  public override resourceCount: number = 0;

  public play() {
    return undefined;
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
        player.addProduction(Resources.ENERGY, 1);
        return undefined;
      }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this, 1);
        return undefined;
      }),
    );
  }
}
