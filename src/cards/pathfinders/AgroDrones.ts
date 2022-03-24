import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resources} from '../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../../common/cards/Tags';

export class AgroDrones extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.AGRO_DRONES,
      cost: 14,
      tags: [Tags.PLANT, Tags.MARS],

      requirements: CardRequirements.builder((b) => b.temperature(-18)),
      metadata: {
        cardNumber: 'Pf04',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel and 1 energy to gain 3 plants.', (eb) => {
            eb.steel(1).energy(1).startAction.plants(3);
          });
        }),
        description: 'Requires -18° C or warmer.',
      },
    });
  }

  public canAct(player: Player) {
    return player.steel > 0 && player.energy > 0;
  }

  public action(player: Player) {
    player.deductResource(Resources.STEEL, 1);
    player.deductResource(Resources.ENERGY, 1);
    player.addResource(Resources.PLANTS, 3);
    player.game.log('${0} spent 1 steel and 1 energy to gain 3 plants.', (b) => b.player(player));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

