import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {TITLES} from '../../inputs/titles';

export class ForcedPrecipitation extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.FORCED_PRECIPITATION,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 8,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '226',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to add 1 floater to THIS card.', (eb) => {
            eb.megacredits(2).startAction.resource(CardResource.FLOATER);
          }).br;
          b.or().br;
          b.action('Spend 2 floaters here to increase Venus 1 step.', (eb) => {
            eb.resource(CardResource.FLOATER, 2).startAction.venus(1);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    if (player.canAfford(2)) {
      return true;
    }
    if (this.resourceCount > 1 && player.canAfford({cost: 0, tr: {venus: 1}})) {
      if (player.game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
        this.warnings.add('maxvenus');
      }
      return true;
    }
    return false;
  }

  public action(player: IPlayer) {
    const opts = [];

    const addResource = new SelectOption('Pay 2 M€ to add 1 floater to this card', 'Pay').andThen(() => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters').andThen(() => this.spendResource(player));
    if (player.game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
      spendResource.warnings = ['maxvenus'];
    }
    if (this.resourceCount > 1 && player.canAfford({cost: 0, tr: {venus: 1}})) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    if (player.canAfford(2)) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 2, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => player.addResourceTo(this, {log: true}));
    return undefined;
  }

  private spendResource(player: IPlayer) {
    player.removeResourceFrom(this, 2);
    const actual = player.game.increaseVenusScaleLevel(player, 1);
    LogHelper.logVenusIncrease(player, actual);
    return undefined;
  }
}
