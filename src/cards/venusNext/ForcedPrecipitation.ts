import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../constants';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class ForcedPrecipitation extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.FORCED_PRECIPITATION,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 8,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '226',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to add 1 Floater to THIS card.', (eb) => {
            eb.megacredits(2).startAction.floaters(1).asterix();
          }).br;
          b.or().br;
          b.action('Spend 2 Floaters here to increase Venus 1 step.', (eb) => {
            eb.floaters(2).startAction.venus(1);
          });
        }),
      },
    });
  };
  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canSpendResource = this.resourceCount > 1 && !venusMaxed;

    return player.canAfford(2) || (canSpendResource && player.canAfford(0, {tr: {venus: 1}}));
  }

  public action(player: Player) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Pay 2 M€ to add 1 floater to this card', 'Pay', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters', () => this.spendResource(player));
    if (this.resourceCount > 1 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE && player.canAfford(0, {tr: {venus: 1}})) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    };

    if (player.canAfford(2)) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for action'}));
    player.addResourceTo(this, {log: true});
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this, 2);
    player.game.increaseVenusScaleLevel(player, 1);
    LogHelper.logVenusIncrease( player, 1);
    return undefined;
  }
}
