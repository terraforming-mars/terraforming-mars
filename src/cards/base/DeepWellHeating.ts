import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class DeepWellHeating extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DEEP_WELL_HEATING,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 13,
      productionBox: Units.of({energy: 1}),
      tr: {temperature: 1},

      metadata: {
        cardNumber: '003',
        description: 'Increase your Energy production 1 step. Increase temperature 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).temperature(1);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return player.game.increaseTemperature(player, 1);
  }
}
