import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceMirrors extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_MIRRORS,
      tags: [Tags.ENERGY, Tags.SPACE],
      cost: 3,

      metadata: {
        cardNumber: '076',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 7 M€ to increase your energy production 1 step.', (eb) => {
            eb.megacredits(7).startAction.production((pb) => pb.energy(1));
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.canAfford(7);
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 7, {title: 'Select how to pay for action'}));
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}
