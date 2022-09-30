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
import {Card} from '../Card';

export class LocalShading extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.LOCAL_SHADING,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 4,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '235',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.or().br;
          b.action('Spend 1 floater here to raise your M€ production 1 step.', (eb) => {
            eb.floaters(1).startAction.production((pb) => pb.megacredits(1));
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

    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Add 1 floater to this card', 'Add floater', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 floater to increase M€ production 1 step', 'Remove floater', () => this.spendResource(player));

    opts.push(spendResource);
    opts.push(addResource);

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.production.add(Resources.MEGACREDITS, 1);
    return undefined;
  }
}
