import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {IActionCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SolarPanelFoundry extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.SOLAR_PANEL_FOUNDRY,
      cardType: CardType.ACTIVE,
      tags: [Tags.ENERGY, Tags.MOON, Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: 'M89',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 Steel to increase your Energy Production 1 step.',
            (eb) => eb.startAction.steel(2).arrow().production((pb) => pb.energy(1)));
        }),
      },
    });
  };

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.steel >= 2;
  }

  public action(player: Player) {
    player.steel -= 2;
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}
