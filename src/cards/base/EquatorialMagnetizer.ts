import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EquatorialMagnetizer extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EQUATORIAL_MAGNETIZER,
      tags: [Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '015',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to increase your terraform rating 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.tr(1);
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 && player.canAfford(0, {tr: {tr: 1}});
  }
  public action(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.increaseTerraformRating();
    return undefined;
  }
}

