import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class LocalShading extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.LOCAL_SHADING,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 4,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '235',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.or().br;
          b.action('Spend 1 Floater here to raise your MC production 1 step.', (eb) => {
            eb.floaters(1).startAction.production((pb) => pb.megacredits(1));
          });
        }),
      },
    });
  };
  public resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    if (this.resourceCount < 1) {
      this.resourceCount++;
      return undefined;
    }

    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Add 1 floater to this card', 'Add floater', () => this.addResource());
    const spendResource = new SelectOption('Remove 1 floater to increase MC production 1 step', 'Remove floater', () => this.spendResource(player));

    opts.push(spendResource);
    opts.push(addResource);

    return new OrOptions(...opts);
  }

  private addResource() {
    this.resourceCount++;
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
