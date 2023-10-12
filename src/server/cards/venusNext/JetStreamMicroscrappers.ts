import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Payment} from '../../../common/inputs/Payment';

export class JetStreamMicroscrappers extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.JET_STREAM_MICROSCRAPPERS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 12,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '234',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here', (eb) => {
            eb.titanium(1).startAction.floaters(2);
          }).br;
          b.or().br;
          b.action('Spend 2 floaters here to raise Venus 1 step', (eb) => {
            eb.floaters(2).startAction.venus(1);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canSpendResource = this.resourceCount > 1 && !venusMaxed;

    return player.titanium > 0 || (canSpendResource && player.canAfford({cost: 0, tr: {venus: 1}}));
  }

  public action(player: IPlayer) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Spend one titanium to add 2 floaters to this card', 'Spend titanium').andThen(() => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters').andThen(() => this.spendResource(player));

    if (this.resourceCount > 1 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    if (player.titanium > 0) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: IPlayer) {
    player.addResourceTo(this, {qty: 2, log: true});
    player.pay(Payment.of({titanium: 1}));
    return undefined;
  }

  private spendResource(player: IPlayer) {
    player.removeResourceFrom(this, 2);
    const actual = player.game.increaseVenusScaleLevel(player, 1);
    LogHelper.logVenusIncrease(player, actual);
    return undefined;
  }
}
