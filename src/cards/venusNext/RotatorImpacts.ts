import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../common/constants';
import {CardName} from '../../common/cards/CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {max} from '../Options';

export class RotatorImpacts extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.ROTATOR_IMPACTS,
      cardType: CardType.ACTIVE,
      tags: [Tags.SPACE],
      cost: 6,
      resourceType: CardResource.ASTEROID,

      requirements: CardRequirements.builder((b) => b.venus(14, {max})),
      metadata: {
        cardNumber: '243',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 M€ to add an asteroid resource to this card [TITANIUM MAY BE USED].', (eb) => {
            eb.megacredits(6).openBrackets.titanium(1).closeBrackets.startAction.asteroids(1);
          }).br;
          b.action('Spend 1 resource from this card to increase Venus 1 step.', (eb) => {
            eb.or().asteroids(1).startAction.venus(1);
          });
        }),
        description: 'Venus must be 14% or lower',
      },
    });
  }
  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canSpendResource = this.resourceCount > 0 && !venusMaxed;

    return player.canAfford(6, {titanium: true}) || (canSpendResource && player.canAfford(0, {tr: {venus: 1}}));
  }

  public action(player: Player) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Pay 6 to add 1 asteroid to this card', 'Pay', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 asteroid to raise Venus 1 step', 'Remove asteroid', () => this.spendResource(player));

    if (this.resourceCount > 0 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    if (player.canAfford(6, {titanium: true})) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 6, {canUseTitanium: true, title: 'Select how to pay for action'}));
    player.addResourceTo(this, {log: true});
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.game.increaseVenusScaleLevel(player, 1);
    player.game.log('${0} removed an asteroid resource to increase Venus scale 1 step', (b) => b.player(player));
    return undefined;
  }
}
